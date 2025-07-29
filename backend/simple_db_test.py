import asyncio
import asyncpg
import time

async def simple_connection_test():
    """Test direct asyncpg connection to VDS PostgreSQL."""
    print("🔍 Testing connection to VDS PostgreSQL (206.81.16.93)...")
    
    # VDS connection parameters
    db_params = {
        "host": "206.81.16.93",
        "port": 5432,
        "user": "dekouser", 
        "password": "deko123!",
        "database": "dekodb"
    }
    
    print(f"📡 Connecting to: {db_params['host']}:{db_params['port']}")
    print(f"👤 User: {db_params['user']}")
    print(f"🗄️ Database: {db_params['database']}")
    
    # Test 1: Connection speed
    start_time = time.time()
    try:
        conn = await asyncpg.connect(**db_params)
        end_time = time.time()
        connection_time = (end_time - start_time) * 1000
        print(f"✅ Connection established: {connection_time:.2f}ms")
        
        if connection_time > 1000:
            print("⚠️ WARNING: Connection time > 1 second indicates network issues")
        elif connection_time > 500:
            print("⚠️ SLOW: Connection time > 500ms is considered slow")
        else:
            print("🚀 GOOD: Connection time is acceptable")
        
        # Test 2: Simple query
        start_time = time.time()
        result = await conn.fetchval("SELECT 1")
        end_time = time.time()
        query_time = (end_time - start_time) * 1000
        print(f"✅ Simple query (SELECT 1): {query_time:.2f}ms")
        
        # Test 3: Database info
        start_time = time.time()
        version = await conn.fetchval("SELECT version()")
        end_time = time.time()
        version_time = (end_time - start_time) * 1000
        print(f"✅ Version query: {version_time:.2f}ms")
        print(f"📊 PostgreSQL: {version.split(',')[0]}")
        
        # Test 4: User count query
        start_time = time.time()
        count = await conn.fetchval("SELECT COUNT(*) FROM users")
        end_time = time.time()
        count_time = (end_time - start_time) * 1000
        print(f"✅ User count query: {count_time:.2f}ms")
        print(f"📊 Users in database: {count}")
        
        # Test 5: Design count query
        start_time = time.time()
        design_count = await conn.fetchval("SELECT COUNT(*) FROM designs")
        end_time = time.time()
        design_time = (end_time - start_time) * 1000
        print(f"✅ Design count query: {design_time:.2f}ms")
        print(f"📊 Designs in database: {design_count}")
        
        # Test 6: Network latency test (multiple pings)
        print("\n🌐 Network latency test (5 pings):")
        latencies = []
        for i in range(5):
            start_time = time.time()
            await conn.fetchval("SELECT 1")
            end_time = time.time()
            latency = (end_time - start_time) * 1000
            latencies.append(latency)
            print(f"   Ping {i+1}: {latency:.2f}ms")
        
        avg_latency = sum(latencies) / len(latencies)
        print(f"📊 Average latency: {avg_latency:.2f}ms")
        
        if avg_latency > 200:
            print("⚠️ HIGH LATENCY: Network connection to VDS is slow")
        elif avg_latency > 100:
            print("⚠️ MODERATE LATENCY: Consider optimizing queries")
        else:
            print("🚀 LOW LATENCY: Network connection is good")
        
        await conn.close()
        print("✅ Connection closed successfully")
        
    except Exception as e:
        print(f"❌ Connection failed: {e}")
        print("🔧 Possible issues:")
        print("   - VDS firewall blocking connection")
        print("   - PostgreSQL not running on VDS")
        print("   - Wrong credentials")
        print("   - Network connectivity issues")

if __name__ == "__main__":
    asyncio.run(simple_connection_test())
