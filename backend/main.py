import os
import asyncio
from datetime import datetime, timezone
from typing import Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, field_validator
from dotenv import load_dotenv
from hindsight_client import Hindsight
from groq import AsyncGroq
from supabase import create_client, Client


# ==========================================
# LOAD ENVIRONMENT VARIABLES
# ==========================================

load_dotenv()


# ==========================================
# VALIDATE ENVIRONMENT VARIABLES ON STARTUP
# ==========================================

REQUIRED_ENV_VARS = [
    "HINDSIGHT_API_KEY",
    "HINDSIGHT_BANK_ID",
    "HINDSIGHT_BASE_URL",
    "GROQ_API_KEY",
    "SUPABASE_URL",
    "SUPABASE_SECRET_KEY"
]

missing_vars = [var for var in REQUIRED_ENV_VARS if not os.getenv(var)]
if missing_vars:
    vars_str = ", ".join(missing_vars)
    raise RuntimeError(
        f"OpsMemory Backend configuration error: Missing required environment variables: {vars_str}"
    )


# ==========================================
# FASTAPI CONFIGURATION
# ==========================================

app = FastAPI(
    title="OpsMemory API",
    description="AI Incident Response Engine backed by Hindsight Long-Term Memory, Groq, and Supabase",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==========================================
# CLIENT INITIALIZATIONS
# ==========================================

BANK_ID = os.getenv("HINDSIGHT_BANK_ID")

hindsight = Hindsight(
    base_url=os.getenv("HINDSIGHT_BASE_URL"),
    api_key=os.getenv("HINDSIGHT_API_KEY")
)

groq = AsyncGroq(
    api_key=os.getenv("GROQ_API_KEY")
)

supabase: Client = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_SECRET_KEY")
)


# ==========================================
# DATA MODELS & VALIDATORS
# ==========================================

class Incident(BaseModel):
    title: str
    service: str
    severity: str
    environment: str
    symptoms: str
    logs: str

    @field_validator("title", "service", "symptoms")
    @classmethod
    def validate_non_empty(cls, v: str, info) -> str:
        if not v or not v.strip():
            raise ValueError(f"Field '{info.field_name}' must not be empty or whitespace.")
        return v.strip()


class IncidentResolution(BaseModel):
    incident_title: str
    service: str
    root_cause: str
    resolution: str
    outcome: str
    time_to_resolution: str
    incident_id: Optional[str] = None

    @field_validator("incident_title", "service", "root_cause", "resolution")
    @classmethod
    def validate_resolution_non_empty(cls, v: str, info) -> str:
        if not v or not v.strip():
            raise ValueError(f"Field '{info.field_name}' must not be empty or whitespace.")
        return v.strip()


# ==========================================
# ROOT & HEALTH CHECK ENDPOINTS
# ==========================================

@app.get("/")
def root():
    return {
        "message": "OpsMemory API is running",
        "version": "1.0.0"
    }


@app.get("/health")
def health():
    return {
        "status": "ok",
        "memory_bank": BANK_ID
    }


# ==========================================
# INVESTIGATE INCIDENT
# ==========================================

@app.post("/api/incidents/investigate")
async def investigate_incident(incident: Incident):
    query = f"""Production incident investigation.

Service: {incident.service}
Severity: {incident.severity}
Environment: {incident.environment}

Symptoms:
{incident.symptoms}

Logs:
{incident.logs}

Find previous incidents with similar symptoms, root causes, and successful resolutions."""

    try:
        # --------------------------------------
        # 1. SAVE INCIDENT TO SUPABASE
        # --------------------------------------
        incident_record = None
        try:
            incident_record = await asyncio.to_thread(
                supabase.table("incidents").insert({
                    "title": incident.title,
                    "service": incident.service,
                    "severity": incident.severity,
                    "environment": incident.environment,
                    "symptoms": incident.symptoms,
                    "logs": incident.logs,
                    "status": "investigating"
                }).execute
            )
        except Exception as db_err:
            print(f"Warning: Supabase insert failed during investigate: {db_err}")

        # --------------------------------------
        # 2. RECALL PREVIOUS EXPERIENCE (HINDSIGHT)
        # --------------------------------------
        memories = []
        hindsight_error = None
        try:
            result = await asyncio.wait_for(
                hindsight.arecall(
                    bank_id=BANK_ID,
                    query=query
                ),
                timeout=20.0
            )
            for memory in result.results:
                memories.append({
                    "type": memory.type,
                    "text": memory.text
                })
        except asyncio.TimeoutError:
            hindsight_error = "Hindsight memory recall timed out after 20 seconds."
            print(hindsight_error)
        except Exception as hs_err:
            hindsight_error = f"Hindsight recall notice: {str(hs_err)}"
            print(hindsight_error)

        # --------------------------------------
        # 3. PREPARE MEMORY FOR GROQ
        # --------------------------------------
        if memories:
            memory_text = "\n\n".join(
                f"[{m['type']}] {m['text']}"
                for m in memories
            )
        else:
            memory_text = "(No previous memories found in Hindsight for this incident pattern. Analyze based on standard SRE best practices and state that no historical memories were available.)"

        # --------------------------------------
        # 4. GROQ AI INVESTIGATION
        # --------------------------------------
        prompt = f"""You are OpsMemory, an AI incident response assistant for DevOps and SRE engineers.

Analyze the current production incident using the previous incident experiences retrieved from memory.

CURRENT INCIDENT:

Title:
{incident.title}

Service:
{incident.service}

Severity:
{incident.severity}

Environment:
{incident.environment}

Symptoms:
{incident.symptoms}

Logs:
{incident.logs}


PREVIOUS INCIDENT MEMORIES:

{memory_text}


Provide a concise, highly structured investigation containing:

1. Likely root cause
2. Evidence from previous incidents (or state 'None recorded' if no previous memories exist)
3. Recommended immediate actions
4. Previous resolution that may be relevant (or state 'None recorded' if no previous memories exist)
5. Important caution or verification step

CRITICAL INSTRUCTIONS:
- Do not claim certainty when the evidence is insufficient.
- Clearly distinguish previous experience (FROM MEMORY) from your recommendation (AI RECOMMENDATION).
- Do not state a previous memory as a fact about the current incident.
- If no previous memories exist, do not invent prior resolutions.
"""

        try:
            completion = await asyncio.wait_for(
                groq.chat.completions.create(
                    model="openai/gpt-oss-20b",
                    messages=[
                        {
                            "role": "system",
                            "content": (
                                "You are a careful production incident response assistant. "
                                "Maintain strict separation between recalled memory evidence and recommended actions."
                            )
                        },
                        {
                            "role": "user",
                            "content": prompt
                        }
                    ],
                    temperature=0.2,
                    max_completion_tokens=1500
                ),
                timeout=30.0
            )

            raw_analysis = completion.choices[0].message.content or ""
            if not raw_analysis.strip():
                raw_analysis = getattr(completion.choices[0].message, "reasoning", "") or ""
            if not raw_analysis.strip():
                raw_analysis = "Investigation analysis could not be generated. Please retry the investigation."
        except asyncio.TimeoutError:
            raise HTTPException(
                status_code=504,
                detail="Groq AI reasoning service timed out while analyzing the incident."
            )
        except Exception as groq_err:
            raise HTTPException(
                status_code=502,
                detail=f"Groq AI service error: {str(groq_err)}"
            )

        # --------------------------------------
        # 5. RETURN INVESTIGATION
        # --------------------------------------
        incident_dict = incident.model_dump()
        if incident_record and incident_record.data:
            incident_dict["id"] = incident_record.data[0].get("id")
            incident_dict["created_at"] = incident_record.data[0].get("created_at")

        response_data = {
            "incident": incident_dict,
            "memory_bank": BANK_ID,
            "memories_found": len(memories),
            "relevant_memories": memories,
            "ai_analysis": raw_analysis
        }
        if hindsight_error:
            response_data["hindsight_notice"] = hindsight_error

        return response_data

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Investigation failed: {str(e)}"
        )


# ==========================================
# RESOLVE INCIDENT
# ==========================================

@app.post("/api/incidents/resolve")
async def resolve_incident(resolution: IncidentResolution):
    memory = f"""Incident Resolution Experience

Incident:
{resolution.incident_title}

Service:
{resolution.service}

Root Cause:
{resolution.root_cause}

Resolution:
{resolution.resolution}

Outcome:
{resolution.outcome}

Time to Resolution:
{resolution.time_to_resolution}

This incident has been resolved successfully.
This experience should be used when similar incidents occur in the future."""

    hindsight_success = False
    database_success = False
    errors = []

    # --------------------------------------
    # 1. STORE EXPERIENCE IN HINDSIGHT
    # --------------------------------------
    try:
        await hindsight.aretain(
            bank_id=BANK_ID,
            content=memory
        )
        hindsight_success = True
    except Exception as hs_err:
        errors.append(f"Hindsight retain error: {str(hs_err)}")

    # --------------------------------------
    # 2. UPDATE INCIDENT IN SUPABASE
    # --------------------------------------
    try:
        now_iso = datetime.now(timezone.utc).isoformat()
        update_data = {
            "status": "resolved",
            "root_cause": resolution.root_cause,
            "resolution": resolution.resolution,
            "outcome": resolution.outcome,
            "time_to_resolution": resolution.time_to_resolution,
            "resolved_at": now_iso
        }

        if resolution.incident_id:
            update_query = supabase.table("incidents").update(update_data).eq("id", resolution.incident_id)
            update_result = await asyncio.to_thread(update_query.execute)
            database_success = bool(update_result.data)
        else:
            # Target active investigating incident with matching title & service
            update_query = (
                supabase
                .table("incidents")
                .update(update_data)
                .eq("title", resolution.incident_title)
                .eq("service", resolution.service)
                .eq("status", "investigating")
            )
            update_result = await asyncio.to_thread(update_query.execute)
            if not update_result.data:
                # Fallback to title and service without status filter
                fallback_query = (
                    supabase
                    .table("incidents")
                    .update(update_data)
                    .eq("title", resolution.incident_title)
                    .eq("service", resolution.service)
                )
                fallback_result = await asyncio.to_thread(fallback_query.execute)
                database_success = bool(fallback_result.data)
            else:
                database_success = True
    except Exception as db_err:
        errors.append(f"Supabase update error: {str(db_err)}")

    # Check for total failure
    if not hindsight_success and not database_success:
        raise HTTPException(
            status_code=500,
            detail=f"Incident resolution failed completely. Errors: {'; '.join(errors)}"
        )

    # Structured response with partial failure transparency
    overall_status = "success" if (hindsight_success and database_success) else "partial_success"
    if hindsight_success and database_success:
        message = "Incident resolution stored in OpsMemory"
    elif hindsight_success:
        message = "Incident resolution stored in Hindsight memory, but database status update encountered an issue."
    else:
        message = "Incident updated in database, but Hindsight memory retention encountered an issue."

    return {
        "status": overall_status,
        "message": message,
        "memory_bank": BANK_ID,
        "hindsight_retained": hindsight_success,
        "database_updated": database_success,
        "errors": errors if errors else None,
        "stored_experience": {
            "incident": resolution.incident_title,
            "service": resolution.service,
            "root_cause": resolution.root_cause,
            "resolution": resolution.resolution,
            "outcome": resolution.outcome,
            "time_to_resolution": resolution.time_to_resolution
        }
    }
