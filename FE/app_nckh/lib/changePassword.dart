import 'dart:convert';
import 'package:app_nckh/changePasswordSuccess.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

class ChangePasswordScreen extends StatefulWidget {
  final String email;
  final String otp;
  const ChangePasswordScreen({super.key, required this.email, required this.otp});

  @override
  State<ChangePasswordScreen> createState() => _ChangePasswordScreenState();
}

class _ChangePasswordScreenState extends State<ChangePasswordScreen> {
  final TextEditingController _passwordController = TextEditingController();
  final TextEditingController _confirmPasswordController = TextEditingController();

  String? _errorMessage;
  bool _isLoading = false;

  // 👁 biến toggle ẩn/hiện mật khẩu
  bool _obscurePassword = true;
  bool _obscureConfirmPassword = true;

  bool validatePassword(String password, String confirmPassword) {
    if (password.length < 6) {
      setState(() => _errorMessage = "Mật khẩu phải có ít nhất 6 ký tự");
      return false;
    }
    if (!RegExp(r'[!@#$%^&*(),.?":{}|<>]').hasMatch(password)) {
      setState(() => _errorMessage = "Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt");
      return false;
    }
    if (password != confirmPassword) {
      setState(() => _errorMessage = "Mật khẩu xác nhận không khớp");
      return false;
    }
    setState(() => _errorMessage = null);
    return true;
  }

  Future<void> _changePassword(String password) async {
    setState(() {
      _isLoading = true;
    });

    final url = Uri.parse("http://localhost:8080/api/v1/password/change");

    final body = jsonEncode({
      "code": widget.otp,
      "email": widget.email,
      "password": password,
    });

    try {
      final response = await http.post(
        url,
        headers: {"Content-Type": "application/json"},
        body: body,
      );

      final data = jsonDecode(response.body);

      if (response.statusCode == 200 && data["status"] == 200) {
        Navigator.pushAndRemoveUntil(
          context,
          MaterialPageRoute(builder: (context) => const ChangePasswordSuccess()),
          (route) => false,
        );
      } else {
        setState(() {
          _errorMessage = data["message"] ?? "Đổi mật khẩu thất bại";
        });
      }
    } catch (e) {
      setState(() {
        _errorMessage = "Có lỗi xảy ra: $e";
      });
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.black87),
          onPressed: () {
            Navigator.pop(context);
          },
        ),
        title: const Text(
          "Đổi mật khẩu",
          style: TextStyle(
            color: Colors.black87,
            fontSize: 18,
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
      body: Padding(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 12),
            const Text(
              "Nhập mật khẩu mới",
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w600,
                color: Colors.black87,
              ),
            ),
            const SizedBox(height: 24),

            // Password field
            TextField(
              controller: _passwordController,
              obscureText: _obscurePassword,
              decoration: InputDecoration(
                hintText: "Mật khẩu mới",
                filled: true,
                fillColor: const Color(0xFFF6F8FF),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: BorderSide.none,
                ),
                contentPadding: const EdgeInsets.symmetric(
                  vertical: 16,
                  horizontal: 16,
                ),
                suffixIcon: IconButton(
                  icon: Icon(
                    _obscurePassword ? Icons.visibility_off : Icons.visibility,
                    color: Colors.grey,
                  ),
                  onPressed: () {
                    setState(() {
                      _obscurePassword = !_obscurePassword;
                    });
                  },
                ),
              ),
            ),

            const SizedBox(height: 16),

            // Confirm password field
            TextField(
              controller: _confirmPasswordController,
              obscureText: _obscureConfirmPassword,
              decoration: InputDecoration(
                hintText: "Xác nhận mật khẩu",
                filled: true,
                fillColor: const Color(0xFFF6F8FF),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: BorderSide.none,
                ),
                contentPadding: const EdgeInsets.symmetric(
                  vertical: 16,
                  horizontal: 16,
                ),
                suffixIcon: IconButton(
                  icon: Icon(
                    _obscureConfirmPassword ? Icons.visibility_off : Icons.visibility,
                    color: Colors.grey,
                  ),
                  onPressed: () {
                    setState(() {
                      _obscureConfirmPassword = !_obscureConfirmPassword;
                    });
                  },
                ),
              ),
            ),

            if (_errorMessage != null)
              Padding(
                padding: const EdgeInsets.only(top: 8, left: 4),
                child: Text(
                  _errorMessage!,
                  style: const TextStyle(color: Colors.red, fontSize: 14),
                ),
              ),

            const SizedBox(height: 30),

            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF49BBBD),
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8),
                  ),
                ),
                onPressed: _isLoading
                    ? null
                    : () {
                        final password = _passwordController.text.trim();
                        final confirmPassword = _confirmPasswordController.text.trim();

                        if (validatePassword(password, confirmPassword)) {
                          _changePassword(password);
                        }
                      },
                child: _isLoading
                    ? const CircularProgressIndicator(color: Colors.white)
                    : const Text(
                        "Đổi mật khẩu",
                        style: TextStyle(fontSize: 16, color: Colors.white),
                      ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
