import 'dart:convert';
import 'package:app_nckh/forgetPasswordMainPage.dart';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:http/http.dart' as http;
import 'registerPage.dart';
import 'introductionApp.dart';
import 'searchSign.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'fileConfiguration.dart';
import 'package:app_links/app_links.dart';

import 'package:url_launcher/url_launcher.dart';

import 'dart:async';

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

    final String baseUrl =
        "http://" + Fileconfiguration.ip + ":8080/api/v1/user";

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
          print("dang nhap ok");
          Navigator.pushReplacement(
            context,
            MaterialPageRoute(
              builder: (context) => SearchSignScreen(token: token),
            ),
          );
        } else {
          setState(() => _loginError = "Không lấy được token từ server");
        }
      } else {
        setState(
          () =>
              _loginError = "Email hoặc mật khẩu không đúng" ?? body["message"],
        );
      }
    } catch (e) {
      setState(() => _loginError = "Không thể kết nối đến server");
    } finally {
      setState(() => _isLoading = false);
    }
  }

  final GoogleSignIn _googleSignIn = GoogleSignIn(
  scopes: ['email', 'profile'],
  serverClientId: '891153081600-rd86f3i1a8t10k6akkqps2crvjqj7t94.apps.googleusercontent.com',
);

  Future<void> signInAndSendToken() async {
  print("Hàm log với Google được gọi");
  try {
    final GoogleSignInAccount? googleUser = await _googleSignIn.signIn();
    if (googleUser == null) {
      print('Người dùng đã hủy đăng nhập Google.');
      return;
    }

    // Bước 2: Lấy authentication object
    final GoogleSignInAuthentication googleAuth = await googleUser.authentication;
    final String? idToken = googleAuth.idToken;

    // Bước 3: Debug thông tin
    print('Google user: ${googleUser.email}');
    print('idToken: $idToken');

    // Bước 4: Kiểm tra token
    if (idToken == null || idToken.isEmpty) {
      print('idToken chưa có, không thể gọi backend.');
      return;
    }

    // Bước 5: Gọi backend với token
    final ip = Fileconfiguration.ip;
    final response = await http.post(
      Uri.parse('http://$ip:8080/api/v1/auth/google?token=$idToken'),
      headers: {'Content-Type': 'application/json'},
    );

    // Bước 6: Kiểm tra kết quả backend
    if (response.statusCode == 200) {
      print('Backend validated successfully: ${response.body}');
    } else {
      print('Backend validation failed: ${response.statusCode} - ${response.body}');
    }

  } catch (e) {
    print('Error: $e');
  }
}
  Future<void> _signInWithGoogle() async {
    setState(() {
      _isLoading = true;
      _loginError = null;
    });

    final String oauthUrl =
        "http://192.168.1.7:8080/oauth2/authorization/google?state=app";

    final appLinks = AppLinks();
    StreamSubscription<Uri>? sub;

    try {
      sub = appLinks.uriLinkStream.listen((Uri uri) async {
        print("📩 Deep link nhận được: $uri");

        if (uri.scheme == 'myapp' && uri.host == 'callback') {
          final token = uri.queryParameters['token'];
          if (token != null && token.isNotEmpty) {
            final prefs = await SharedPreferences.getInstance();
            await prefs.setString("token", token);
            print("✅ Đăng nhập thành công, token: $token");

            if (!mounted) return;
            Navigator.pushReplacement(
              context,
              MaterialPageRoute(
                builder: (context) => SearchSignScreen(token: token),
              ),
            );
          } else {
            setState(() => _loginError = "Không nhận được token từ server");
          }
        }
      });

      final Uri url = Uri.parse(oauthUrl);
      if (!await launchUrl(url, mode: LaunchMode.externalApplication)) {
        throw Exception('Không thể mở trình duyệt để đăng nhập');
      }
    } catch (e) {
      print("❌ Lỗi đăng nhập Google: $e");
      setState(() => _loginError = "Đăng nhập Google thất bại: $e");
    } finally {
      // Không cancel quá sớm, chỉ cancel khi rời khỏi màn hình hoặc timeout
      Future.delayed(const Duration(seconds: 30), () {
        sub?.cancel();
      });
      setState(() => _isLoading = false);
    }
  }

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
                        MaterialPageRoute(
                          builder: (context) => const introductionApp(),
                        ),
                        (route) => false,
                      );
                    },
                    icon: const Icon(Icons.arrow_back_ios, size: 20),
                  ),
                  const Text(
                    "Đăng nhập",
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.w600,
                      color: Color(0xFF262A3B),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 40),
              const Center(
                child: Text(
                  "Chào mừng đến với DApp",
                  style: TextStyle(
                    fontSize: 22,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFF49BBBD),
                  ),
                ),
              ),
              const SizedBox(height: 32),

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
                ),
              ),
              if (_emailError != null)
                Padding(
                  padding: const EdgeInsets.only(top: 5, left: 8),
                  child: Text(
                    _emailError!,
                    style: const TextStyle(color: Colors.red, fontSize: 14),
                  ),
                ),
              const SizedBox(height: 16),

              TextField(
                controller: _passwordController,
                obscureText: _isObscure,
                decoration: InputDecoration(
                  hintText: "Mật khẩu",
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
                  suffixIcon: IconButton(
                    icon: Icon(
                      _isObscure ? Icons.visibility_off : Icons.visibility,
                      color: Colors.grey,
                    ),
                    onPressed: () => setState(() => _isObscure = !_isObscure),
                  ),
                ),
              ),
              if (_passwordError != null)
                Padding(
                  padding: const EdgeInsets.only(top: 5, left: 8),
                  child: Text(
                    _passwordError!,
                    style: const TextStyle(color: Colors.red, fontSize: 14),
                  ),
                ),
              if (_loginError != null)
                Padding(
                  padding: const EdgeInsets.only(top: 5, left: 8),
                  child: Text(
                    _loginError!,
                    style: const TextStyle(color: Colors.red, fontSize: 14),
                  ),
                ),

              const SizedBox(height: 8),
              Align(
                alignment: Alignment.centerRight,
                child: TextButton(
                  onPressed: () {
                    Navigator.pushReplacement(
                      context,
                      MaterialPageRoute(
                        builder: (context) => const ForgetPasswordMainPage(),
                      ),
                    );
                  },
                  child: const Text(
                    "Quên mật khẩu ?",
                    style: TextStyle(
                      fontSize: 14,
                      color: Color(0xFF49BBBD),
                      fontWeight: FontWeight.w500,
                    ),
                  ),
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
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                  child: _isLoading
                      ? const CircularProgressIndicator(color: Colors.white)
                      : const Text(
                          "Đăng nhập",
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                          ),
                        ),
                ),
              ),

              const SizedBox(height: 16),
              Center(
                child: TextButton(
                  onPressed: () {
                    Navigator.pushReplacement(
                      context,
                      MaterialPageRoute(
                        builder: (context) => const RegisterScreen(),
                      ),
                    );
                  },
                  child: const Text(
                    "Tạo tài khoản",
                    style: TextStyle(
                      fontSize: 15,
                      color: Color(0xFF262A3B),
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ),
              ),

              const SizedBox(height: 24),
              const Center(
                child: Text(
                  "Tiếp tục với",
                  style: TextStyle(
                    fontSize: 15,
                    color: Color(0xFF49BBBD),
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
              const SizedBox(height: 16),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  _socialButton(
                    "assets/img/google.png",
                    onTap: signInAndSendToken,
                  ),
                  const SizedBox(width: 16),
                  _socialButton(
                    "assets/img/facebook.png",
                    onTap: () async {
                      print("Facebook login pressed");
                    },
                  ),
                  const SizedBox(width: 16),
                  _socialButton(
                    "assets/img/github.png",
                    onTap: () async {
                      print("Github login pressed");
                    },
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _socialButton(
    String imagePath, {
    required Future<void> Function() onTap,
  }) {
    return InkWell(
      onTap: () async {
        print("Button $imagePath pressed"); // log để chắc chắn bấm được
        await onTap(); // gọi hàm async
      },
      borderRadius: BorderRadius.circular(50),
      child: Container(
        width: 50,
        height: 50,
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          border: Border.all(color: Colors.grey.shade300, width: 1),
        ),
        child: Center(child: Image.asset(imagePath, width: 24, height: 24)),
      ),
    );
  }
}

class GoogleAuthService {
  final String backendGoogleLoginUrl =
      "http://" + Fileconfiguration.ip + "8080/api/v1/oauth2/google";
  final FlutterSecureStorage _storage = const FlutterSecureStorage();

  /// Đăng nhập với Google

  /// Lấy JWT token từ storage
  Future<String?> getToken() async {
    return await _storage.read(key: "jwt_token");
  }
}
