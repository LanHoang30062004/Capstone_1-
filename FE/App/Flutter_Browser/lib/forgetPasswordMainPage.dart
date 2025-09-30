import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

import 'OtpPage.dart';
import 'dart:io' show File; // Cho mobile

import 'loginPage.dart';

class ForgetPasswordMainPage extends StatefulWidget {
  const ForgetPasswordMainPage({super.key});

  @override
  State<ForgetPasswordMainPage> createState() => _ForgetPasswordMainPageState();
}

class _ForgetPasswordMainPageState extends State<ForgetPasswordMainPage> {
  final TextEditingController _emailController = TextEditingController();
  bool _isLoading = false;
  String? _emailError;

  Future<bool> _checkEmailExists(String email) async {
  try {
    final response = await http.get(
      Uri.parse("http://localhost:8080/api/v1/user/email?email=$email"),
    );

    debugPrint("Status code: ${response.statusCode}");
    debugPrint("Response body: ${response.body}");

    if (response.statusCode == 200) {
      final body = jsonDecode(response.body);

      if (body["status"] == 200) {
        return true;
      } else {
        return false; 
      }
    } else {
      return false;
    }
  } catch (e) {
    debugPrint("Lỗi kết nối khi check email: $e");
    return false;
  }
}

Future<bool> _sendOtpToEmail(String email) async {
  try {
    final response = await http.post(
      Uri.parse("http://localhost:8080/api/v1/password/forgot?email=$email"),
    );

    debugPrint("Send OTP - Status code: ${response.statusCode}");
    debugPrint("Send OTP - Body: ${response.body}");

    if (response.statusCode == 200) {
      final body = jsonDecode(response.body);

      if (body["status"] == 200) {
        return true; 
      } else {
        return false; 
      }
    } else {
      return false;
    }
  } catch (e) {
    debugPrint("Lỗi khi gửi OTP: $e");
    return false;
  }
}


  Future<void> _handleSend() async {
  final email = _emailController.text.trim();

  if (email.isEmpty) {
    setState(() {
      _emailError = "Vui lòng nhập email";
    });
    return;
  }

  setState(() {
    _isLoading = true;
    _emailError = null;
  });

  final exists = await _checkEmailExists(email);

  if (!exists) {
    setState(() {
      _isLoading = false;
      _emailError = "Email không tồn tại";
    });
    return;
  }

  setState(() => _isLoading = false);

  Navigator.push(
    context,
    MaterialPageRoute(
      builder: (context) => OtpScreen(email: email),
    ),
  );

  _sendOtpToEmail(email).then((sent) {
    if (!sent) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Không thể gửi OTP, vui lòng thử lại.")),
      );
    }
  });
}

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Back + Title
              Row(
                children: [
                  IconButton(
                    onPressed: () {
                      Navigator.pushAndRemoveUntil(
                        context,
                        MaterialPageRoute(
                          builder: (context) => const LoginScreen(),
                        ),
                        (route) => false,
                      );
                    },
                    icon: const Icon(Icons.arrow_back_ios, size: 20),
                  ),
                  const Text(
                    "Quên mật khẩu",
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.w600,
                      color: Color(0xFF262A3B),
                    ),
                  ),
                ],
              ),

              const SizedBox(height: 40),

              // Title
              const Center(
                child: Text(
                  "Quên mật khẩu",
                  style: TextStyle(
                    fontSize: 22,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFF49BBBD),
                  ),
                ),
              ),

              const SizedBox(height: 32),

              // Label
              const Text(
                "Nhập email của bạn",
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                  color: Color(0xFF262A3B),
                ),
              ),

              const SizedBox(height: 10),

              // Email Field
              TextField(
                controller: _emailController,
                decoration: InputDecoration(
                  hintText: "Email",
                  filled: true,
                  fillColor: const Color(0xFFF6F6F6),
                  contentPadding: const EdgeInsets.symmetric(
                    horizontal: 16,
                    vertical: 14,
                  ),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: BorderSide.none,
                  ),
                  errorText: _emailError, // hiển thị lỗi trực tiếp dưới field
                ),
              ),

              const SizedBox(height: 20),

              const Text(
                "Chúng tôi sẽ gửi mã xác minh đến email của bạn",
                style: TextStyle(
                  fontSize: 14,
                  color: Color(0xFF262A3B),
                ),
              ),

              const SizedBox(height: 24),

              // Nút Gửi
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: _isLoading ? null : _handleSend,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF49BBBD),
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                    elevation: 4,
                    shadowColor: Colors.tealAccent.withOpacity(0.3),
                  ),
                  child: _isLoading
                      ? const CircularProgressIndicator(color: Colors.white)
                      : const Text(
                          "Gửi",
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                          ),
                        ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
