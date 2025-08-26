import 'package:app_nckh/loginPage.dart';
import 'package:flutter/material.dart';
import 'package:app_nckh/registerPage.dart';

class introductionApp extends StatelessWidget {
  const introductionApp({super.key});
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 24),
          child: Column(
            children: [
              Center(
                child: Image.asset(
                  "assets/img/imgWelcome.png",
                  height: 220,
                  fit: BoxFit.contain,
                ),
              ),
              SizedBox(height: 30),
              Center(
                child: Text(
                  "Giao tiếp tức thì",
                  style: TextStyle(
                    color: const Color(0xFF262A3B),
                    fontSize: 26,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
              Center(
                child: Text(
                  "Hiểu nhau không rào cản",
                  style: TextStyle(
                    color: const Color(0xFF262A3B),
                    fontSize: 26,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
              SizedBox(height: 30),

              Center(
                child: Text(
                  "Nói, nghe và hiểu — được hỗ trợ bởi",
                  style: TextStyle(fontSize: 16),
                ),
              ),
              SizedBox(height: 5),
              Center(
                child: Text(
                  "Công nghệ AI hiện đại.",
                  style: TextStyle(fontSize: 16),
                ),
              ),
              SizedBox(height: 5),
              Center(
                child: Text(
                  "Giao tiếp dễ dàng và nhanh chóng",
                  style: TextStyle(fontSize: 16),
                ),
              ),

              SizedBox(height: 45),

              Center(
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    ElevatedButton(
                      onPressed: () {
                        Navigator.pushReplacement(
                          context,
                          MaterialPageRoute(builder: (context) => LoginScreen()),
                        );
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF49BBBD),
                        padding: const EdgeInsets.symmetric(
                          vertical: 18,
                          horizontal: 36,
                        ),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                        elevation: 6,
                        shadowColor: Colors.black26,
                      ),
                      child: const Text(
                        "Đăng nhập",
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 18,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ),
                    SizedBox(width: 30),
                    TextButton(
                      onPressed: () {
                        Navigator.pushReplacement(
                          context,
                          MaterialPageRoute(builder: (context) => RegisterScreen()),
                        );
                      },
                      child: Text(
                        "Đăng ký",
                        style: TextStyle(
                          color: const Color(0xFF262A3B),
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
