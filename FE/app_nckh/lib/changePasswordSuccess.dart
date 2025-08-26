import 'package:app_nckh/loginPage.dart';
import 'package:flutter/material.dart';
import 'package:app_nckh/registerPage.dart';

class ChangePasswordSuccess extends StatelessWidget {
  const ChangePasswordSuccess({super.key});
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 24),
          child: Column(
            children: [
              SizedBox(height: 40,),
              Center(
                child: Image.asset(
                  "assets/img/lock.png",
                  height: 220,
                  fit: BoxFit.contain,
                ),
              ),
              SizedBox(height: 30),
              Center(
                child: Text(
                  "Đổi mật khẩu thành công",
                  style: TextStyle(
                    color: const Color(0xFF262A3B),
                    fontSize: 18,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ),
              Center(
                child: Text(
                  "Vui lòng sừ dụng mật khẩu mới khi đăng nhập lại",
                  style: TextStyle(
                    color: const Color(0xFF262A3B),
                    fontSize: 18,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ),
              SizedBox(height: 30),

              Center(
                child: SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF49BBBD),
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(8),
                      ),
                    ),
                    onPressed: () {
                      Navigator.pushAndRemoveUntil(
                        context,
                        MaterialPageRoute(
                          builder: (context) => LoginScreen(),
                        ),
                        (route) => false,
                      );
                    },
                    child: const Text(
                      "Đăng nhập ngay",
                      style: TextStyle(fontSize: 16, color: Colors.white),
                    ),
                  ),
                ),
              ),

              SizedBox(height: 45),
            ],
          ),
        ),
      ),
    );
  }
}
