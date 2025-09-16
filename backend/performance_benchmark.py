"""
PersonifID Performance Benchmarking: Measure actual API response
"""
import time
import requests
import statistics
import json
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime

class PersonifIDPerformanceBenchmark:
    def __init__(self, base_url="http://localhost:8000"):
        self.base_url = base_url
        self.results = {}
        
    def authenticate(self):
        """Get authentication token for testing"""
        # Register test user
        register_data = {
            "username": "perftest",
            "email": "perftest@example.com", 
            "password": "testpass123",
            "full_name": "Performance Test User"
        }
        
        try:
            requests.post(f"{self.base_url}/auth/register", json=register_data)
        except:
            pass  # User already exists
            
        # Login
        login_response = requests.post(f"{self.base_url}/auth/token", data={
            "username": "perftest",
            "password": "testpass123"
        })
        
        if login_response.status_code == 200:
            token = login_response.json()["access_token"]
            return {"Authorization": f"Bearer {token}"}
        else:
            raise Exception("Failed to authenticate")
    
    def measure_endpoint_performance(self, endpoint, method="GET", headers=None, data=None, iterations=20):
        """Measure response times for a specific endpoint"""
        response_times = []
        
        print(f" Testing {method} {endpoint} ({iterations} iterations)...")
        
        for i in range(iterations):
            start_time = time.time()
            
            try:
                if method == "GET":
                    response = requests.get(f"{self.base_url}{endpoint}", headers=headers)
                elif method == "POST":
                    response = requests.post(f"{self.base_url}{endpoint}", headers=headers, json=data)
                    
                end_time = time.time()
                
                if response.status_code in [200, 201]:
                    response_time = (end_time - start_time) * 1000  # Convert to milliseconds
                    response_times.append(response_time)
                    print(f"  Request {i+1}: {response_time:.2f}ms")
                else:
                    print(f"  Request {i+1}: Failed ({response.status_code})")
                    
            except Exception as e:
                print(f"  Request {i+1}: Error - {e}")
                
        return response_times
    
    def analyze_response_times(self, response_times, test_name):
        """Analyze response time statistics"""
        if not response_times:
            return None
            
        analysis = {
            "test_name": test_name,
            "total_requests": len(response_times),
            "average_ms": statistics.mean(response_times),
            "median_ms": statistics.median(response_times),
            "min_ms": min(response_times),
            "max_ms": max(response_times),
            "p95_ms": sorted(response_times)[int(0.95 * len(response_times))],
            "p99_ms": sorted(response_times)[int(0.99 * len(response_times))],
            "std_dev": statistics.stdev(response_times) if len(response_times) > 1 else 0
        }
        
        return analysis
    
    def test_concurrent_users(self, num_users=5):
        """Test concurrent user performance"""
        print(f" Testing concurrent performance with {num_users} users...")
        
        def create_user_workflow(user_id):
            """Simulate complete user workflow"""
            try:
                # Register unique user
                user_data = {
                    "username": f"concurrent{user_id}",
                    "email": f"concurrent{user_id}@example.com",
                    "password": "testpass123"
                }
                
                start_time = time.time()
                
                # Register
                register_response = requests.post(f"{self.base_url}/auth/register", json=user_data)
                if register_response.status_code != 200:
                    return None
                    
                # Login
                login_response = requests.post(f"{self.base_url}/auth/token", data={
                    "username": user_data["username"],
                    "password": user_data["password"]
                })
                if login_response.status_code != 200:
                    return None
                    
                token = login_response.json()["access_token"]
                headers = {"Authorization": f"Bearer {token}"}
                
                # Create identity
                identity_response = requests.post(f"{self.base_url}/identities", 
                    headers=headers, 
                    json={"display_name": f"Concurrent Identity {user_id}"}
                )
                
                end_time = time.time()
                
                if identity_response.status_code == 201:
                    return (end_time - start_time) * 1000  # Return total time in ms
                    
            except Exception as e:
                print(f"Concurrent user {user_id} failed: {e}")
                return None
                
        # Execute concurrent workflows
        with ThreadPoolExecutor(max_workers=num_users) as executor:
            futures = [executor.submit(create_user_workflow, i) for i in range(num_users)]
            results = []
            
            for future in as_completed(futures):
                result = future.result()
                if result is not None:
                    results.append(result)
                    
        success_rate = len(results) / num_users
        return {
            "concurrent_users": num_users,
            "successful_workflows": len(results),
            "success_rate": success_rate,
            "average_workflow_time": statistics.mean(results) if results else 0,
            "workflow_times": results
        }
    
    def run_comprehensive_benchmark(self):
        """Run complete performance benchmark suite"""
        print(" Starting PersonifID Performance Benchmark")
        print("=" * 50)
        
        # Authenticate
        headers = self.authenticate()
        print(" Authentication successful")
        
        # Test different endpoints
        tests = [
            ("Identity List", "/identities", "GET", headers, None),
            ("Context List", "/contexts", "GET", headers, None),
            ("User Profile", "/users/me", "GET", headers, None),
            ("Identity Creation", "/identities", "POST", headers, {"display_name": "Perf Test Identity"}),
            ("Context Creation", "/contexts", "POST", headers, {"name": "Perf Test Context"}),
        ]
        
        benchmark_results = []
        
        for test_name, endpoint, method, test_headers, data in tests:
            response_times = self.measure_endpoint_performance(endpoint, method, test_headers, data)
            analysis = self.analyze_response_times(response_times, test_name)
            if analysis:
                benchmark_results.append(analysis)
                
        # Test concurrent performance
        concurrent_results = self.test_concurrent_users(5)
        
        # Generate comprehensive report
        self.generate_performance_report(benchmark_results, concurrent_results)
        
        return benchmark_results, concurrent_results
    
    def generate_performance_report(self, benchmark_results, concurrent_results):
        """Generate detailed performance report"""
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
        report = f"""
PersonifID Performance Benchmark Report
Generated: {timestamp}
{'=' * 60}

INDIVIDUAL ENDPOINT PERFORMANCE:
"""
        
        total_avg = 0
        total_p95 = 0
        
        for result in benchmark_results:
            report += f"""
{result['test_name']}:
  • Average Response Time: {result['average_ms']:.1f}ms
  • 95th Percentile: {result['p95_ms']:.1f}ms  
  • Min/Max: {result['min_ms']:.1f}ms / {result['max_ms']:.1f}ms
  • Requests: {result['total_requests']}
"""
            total_avg += result['average_ms']
            total_p95 += result['p95_ms']
            
        avg_response_time = total_avg / len(benchmark_results)
        avg_p95_time = total_p95 / len(benchmark_results)
        
        report += f"""
OVERALL PERFORMANCE SUMMARY:
  • Average API Response Time: {avg_response_time:.1f}ms
  • Average 95th Percentile: {avg_p95_time:.1f}ms
  • Performance Target (<200ms): {' PASSED' if avg_response_time < 200 else ' FAILED'}

CONCURRENT USER PERFORMANCE:
  • Concurrent Users Tested: {concurrent_results['concurrent_users']}
  • Successful Workflows: {concurrent_results['successful_workflows']}
  • Success Rate: {concurrent_results['success_rate']:.1%}
  • Average Workflow Time: {concurrent_results['average_workflow_time']:.1f}ms

PERFORMANCE ANALYSIS:
"""
        
        if avg_response_time < 150:
            report += "  EXCELLENT - Response times well below target\n"
        elif avg_response_time < 200:
            report += "  GOOD - Response times meet performance targets\n"
        else:
            report += "  NEEDS IMPROVEMENT - Response times exceed targets\n"
            
        if concurrent_results['success_rate'] >= 0.8:
            report += "  ROBUST - System handles concurrent load well\n"
        else:
            report += "  OPTIMIZATION NEEDED - Concurrent performance below target\n"
            
        report += f"""
{'=' * 60}
Evidence for Academic Evaluation:
  • Total test iterations: {sum(r['total_requests'] for r in benchmark_results)}
  • Testing methodology: Automated performance benchmarking
  • Statistical analysis: Mean, median, 95th percentile measurements
  • Load testing: {concurrent_results['concurrent_users']} concurrent user simulation
"""
        
        print(report)
        
        # Save to file for evidence
        with open("performance_benchmark_results.txt", "w") as f:
            f.write(report)
            
        # Save raw data as JSON for further analysis
        with open("performance_raw_data.json", "w") as f:
            json.dump({
                "benchmark_results": benchmark_results,
                "concurrent_results": concurrent_results,
                "summary": {
                    "average_response_time": avg_response_time,
                    "p95_response_time": avg_p95_time,
                    "meets_target": avg_response_time < 200
                }
            }, f, indent=2)
            
        print(f"\n Results saved to:")
        print(f"  • performance_benchmark_results.txt")
        print(f"  • performance_raw_data.json")

if __name__ == "__main__":
    # Ensure FastAPI server is running
    print(" Make sure your FastAPI server is running on http://localhost:8000")
    print(" Run: uvicorn app.main:app --reload")
    input(" Press Enter when server is ready...")
    
    benchmark = PersonifIDPerformanceBenchmark()
    benchmark.run_comprehensive_benchmark()