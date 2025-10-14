import 'dart:convert';
import 'package:app_nckh/forgetPasswordMainPage.dart';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:http/http.dart' as http;
import 'registerPage.dart';
import 'introductionApp.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();

  bool _isObscure = true;
  bool _isLoading = false;

  String? _emailError;
  String? _passwordError;
  String? _loginError;

  Future<void> _login() async {
    final email = _emailController.text.trim();
    final password = _passwordController.text.trim();

    const String baseUrl = "http://192.168.1.9:8080/api/v1/user";

    setState(() {
      _emailError = null;
      _passwordError = null;
      _loginError = null;
    });

    if (email.isEmpty) {
      setState(() => _emailError = "Vui lòng nhập email");
      return;
    }
    if (password.isEmpty) {
      setState(() => _passwordError = "Vui lòng nhập mật khẩu");
      return;
    }

    setState(() => _isLoading = true);

    try {
      final response = await http.post(
        Uri.parse("$baseUrl/login"),
        headers: {"Content-Type": "application/json"},
        body: jsonEncode({"email": email, "password": password}),
      );

      final body = jsonDecode(response.body);

      if (response.statusCode == 200 && body["status"] == 200) {
        final token = body["data"];
        if (token != null && token is String && token.isNotEmpty) {
          final prefs = await SharedPreferences.getInstance();
          await prefs.setString("token", token);
          await prefs.setString("email", email);
          Navigator.pushReplacement(
            context,
            MaterialPageRoute(builder: (context) => const introductionApp()),
          );
        } else {
          setState(() => _loginError = "Không lấy được token từ server");
        }
      } else {
        setState(() => _loginError = body["message"] ?? "Email hoặc mật khẩu không đúng");
      }
    } catch (e) {
      setState(() => _loginError = "Không thể kết nối đến server");
    } finally {
      setState(() => _isLoading = false);
    }
  }

  // Future<void> _signInWithGoogle() async {
  //   setState(() => _isLoading = true);
  //   try {
  //     final googleUser = await GoogleSignIn().signIn();
  //     if (googleUser != null) {
  //       final googleAuth = await googleUser.authentication;
  //       print("Google AccessToken: ${googleAuth.accessToken}");
  //       Navigator.pushReplacement(
  //         context,
  //         MaterialPageRoute(builder: (context) => const introductionApp()),
  //       );
  //     }
  //   } catch (e) {
  //     setState(() => _loginError = "Đăng nhập Google thất bại");
  //   } finally {
  //     setState(() => _isLoading = false);
  //   }
  // }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  IconButton(
                    onPressed: () {
                      Navigator.pushAndRemoveUntil(
                        context,
                        MaterialPageRoute(builder: (context) => const introductionApp()),
                        (route) => false,
                      );
                    },
                    icon: const Icon(Icons.arrow_back_ios, size: 20),
                  ),
                  const Text(
                    "Đăng nhập",
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.w600, color: Color(0xFF262A3B)),
                  ),
                ],
              ),
              const SizedBox(height: 40),
              const Center(
                child: Text(
                  "Chào mừng đến với DApp",
                  style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: Color(0xFF49BBBD)),
                ),
              ),
              const SizedBox(height: 32),

              TextField(
                controller: _emailController,
                decoration: InputDecoration(
                  hintText: "Email",
                  filled: true,
                  fillColor: const Color(0xFFF6F6F6),
                  contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none),
                ),
              ),
              if (_emailError != null)
                Padding(
                  padding: const EdgeInsets.only(top: 5, left: 8),
                  child: Text(_emailError!, style: const TextStyle(color: Colors.red, fontSize: 14)),
                ),
              const SizedBox(height: 16),

              TextField(
                controller: _passwordController,
                obscureText: _isObscure,
                decoration: InputDecoration(
                  hintText: "Mật khẩu",
                  filled: true,
                  fillColor: const Color(0xFFF6F6F6),
                  contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none),
                  suffixIcon: IconButton(
                    icon: Icon(_isObscure ? Icons.visibility_off : Icons.visibility, color: Colors.grey),
                    onPressed: () => setState(() => _isObscure = !_isObscure),
                  ),
                ),
              ),
              if (_passwordError != null)
                Padding(
                  padding: const EdgeInsets.only(top: 5, left: 8),
                  child: Text(_passwordError!, style: const TextStyle(color: Colors.red, fontSize: 14)),
                ),
              if (_loginError != null)
                Padding(
                  padding: const EdgeInsets.only(top: 5, left: 8),
                  child: Text(_loginError!, style: const TextStyle(color: Colors.red, fontSize: 14)),
                ),

              const SizedBox(height: 8),
              Align(
                alignment: Alignment.centerRight,
                child: TextButton(
                  onPressed: () {
                    Navigator.pushReplacement(context, MaterialPageRoute(builder: (context) => const ForgetPasswordMainPage()));
                  },
                  child: const Text("Quên mật khẩu ?", style: TextStyle(fontSize: 14, color: Color(0xFF49BBBD), fontWeight: FontWeight.w500)),
                ),
              ),

              const SizedBox(height: 8),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: _isLoading ? null : _login,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF49BBBD),
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                  child: _isLoading
                      ? const CircularProgressIndicator(color: Colors.white)
                      : const Text("Đăng nhập", style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.white)),
                ),
              ),

              const SizedBox(height: 16),
              Center(
                child: TextButton(
                  onPressed: () {
                    Navigator.pushReplacement(context, MaterialPageRoute(builder: (context) => const RegisterScreen()));
                  },
                  child: const Text("Tạo tài khoản", style: TextStyle(fontSize: 15, color: Color(0xFF262A3B), fontWeight: FontWeight.w500)),
                ),
              ),

              const SizedBox(height: 24),
              const Center(child: Text("Tiếp tục với", style: TextStyle(fontSize: 15, color: Color(0xFF49BBBD), fontWeight: FontWeight.w600))),
              const SizedBox(height: 16),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  // dang nhap voi goggle
                  _socialButton("assets/img/google.png", onTap: (){}),
                  const SizedBox(width: 16),
                  _socialButton("assets/img/facebook.png", onTap: () {}),
                  const SizedBox(width: 16),
                  _socialButton("assets/img/github.png", onTap: () {}),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _socialButton(String imagePath, {VoidCallback? onTap}) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(50),
      child: Container(
        width: 50,
        height: 50,
        decoration: BoxDecoration(shape: BoxShape.circle, border: Border.all(color: Colors.grey.shade300, width: 1)),
        child: Center(child: Image.asset(imagePath, width: 24, height: 24)),
      ),
    );
  }
}
