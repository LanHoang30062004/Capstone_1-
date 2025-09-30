import 'package:app_nckh/loginPage.dart';
import 'package:flutter/material.dart';
import 'dart:io' show File; // Cho mobile


class ChangePasswordSuccess extends StatefulWidget {
  const ChangePasswordSuccess({super.key});

  @override
  State<ChangePasswordSuccess> createState() => _ChangePasswordSuccessState();
}

class _ChangePasswordSuccessState extends State<ChangePasswordSuccess> {
  @override
  void initState() {
    super.initState();

    // Sau 1 giây thì tự động chuyển sang LoginScreen
    Future.delayed(const Duration(seconds: 1), () {
      Navigator.pushAndRemoveUntil(
        context,
        MaterialPageRoute(builder: (context) => const LoginScreen()),
        (route) => false,
      );
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Image.asset(
                "assets/img/lock.png",
                height: 220,
                fit: BoxFit.contain,
              ),
              const SizedBox(height: 30),
              const Text(
                "Đổi mật khẩu thành công",
                style: TextStyle(
                  color: Color(0xFF262A3B),
                  fontSize: 18,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
