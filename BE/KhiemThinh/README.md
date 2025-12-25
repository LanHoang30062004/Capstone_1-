# TEST API
## Apache Benchmark
1. cd C:\
2. cd .\xampp\apache\bin
3. .\ab.exe -n 5000 -c 500 -H "Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiQURNSU4iLCJmdWxsTmFtZSI6InN0cmluZyIsImVtYWlsIjoibWFpaG9hbmdsYW4zMEBnbWFpbC5jb20iLCJhdXRob3JpdGllcyI6IlJPTEVfQURNSU4iLCJzdWIiOiJtYWlob2FuZ2xhbjMwQGdtYWlsLmNvbSIsImV4cCI6MTc2OTE4NTI3M30.L6ZOnvGouq51ANbgX9UHx8YDOie7UL2e5wCt6N0tKqU" http://localhost:8080/api/v1/word?page=0&size=10