import os
from dotenv import load_dotenv
from hindsight_client import Hindsight

load_dotenv()

client = Hindsight(
    base_url=os.getenv("HINDSIGHT_BASE_URL"),
    api_key=os.getenv("HINDSIGHT_API_KEY")
)

BANK_ID = os.getenv("HINDSIGHT_BANK_ID")

print("🧠 Connecting to Hindsight...")
print(f"Memory Bank: {BANK_ID}")

try:
    # STORE MEMORY
    print("\n📥 Storing incident memory...")

    client.retain(
        bank_id=BANK_ID,
        content="""
Incident: Payment API database timeout.

Service: Payment API
Environment: Production
Severity: Critical

Symptoms:
Payment requests returned HTTP 500 errors.
Database connection timeout errors appeared in the logs.

Root Cause:
The database connection pool was exhausted.

Resolution:
The engineering team increased the database connection pool
from 50 to 100 connections.

Outcome:
Payment requests returned to normal.
The incident was resolved in 11 minutes.
        """,
        context="OpsMemory production incident"
    )

    print("✅ Memory stored!")

    # RECALL MEMORY
    print("\n🔎 Searching previous incidents...")

    result = client.recall(
        bank_id=BANK_ID,
        query="Have we previously experienced a database connection timeout or connection pool exhaustion?"
    )

    if not result.results:
        print("❌ No memories found.")
    else:
        print(f"✅ Found {len(result.results)} relevant memories:\n")

        for memory in result.results:
            print(f"[{memory.type}]")
            print(memory.text)
            print("-" * 60)

except Exception as e:
    print("\n❌ ERROR:")
    print(e)

finally:
    client.close()