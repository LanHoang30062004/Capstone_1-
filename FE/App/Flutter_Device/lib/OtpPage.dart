import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'changePassword.dart';
import 'forgetPasswordMainPage.dart';
import 'package:pin_code_fields/pin_code_fields.dart';
import 'dart:io' show File; // Cho mobile
import 'fileConfiguration.dart';

class OtpScreen extends StatefulWidget {
  final String email;
  const OtpScreen({super.key, required this.email});

  @override
  State<OtpScreen> createState() => _OtpScreenState();
}

class _OtpScreenState extends State<OtpScreen> {
  final TextEditingController _otpController = TextEditingController();
  String? _otpError;
  bool _isLoading = false;

  Future<void> _checkOtp() async {
    final otp = _otpController.text.trim();

    if (otp.isEmpty) {
      setState(() {
        _otpError = "Vui lòng nhập mã OTP";
      });
      return;
    }

    setState(() {
      _isLoading = true;
      _otpError = null;
    });

    try {
      final response = await http.post(
        Uri.parse("http://"+Fileconfiguration.ip+":8080/api/v1/password/check"),
        headers: {"Content-Type": "application/json"},
        body: jsonEncode({
          "code": otp,
          "email": widget.email,
          "password": "", // để trống, mật khẩu nhập ở màn sau
        }),
      );

      debugPrint("Check OTP - Status: ${response.statusCode}");
      debugPrint("Check OTP - Body: ${response.body}");

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);

        if (data["data"] == true) {
          Future.delayed(Duration.zero, () {
            Navigator.pushReplacement(
              context,
              MaterialPageRoute(
                builder: (context) =>
                    ChangePasswordScreen(email: widget.email, otp: otp),
              ),
            );
          });
        } else {
          setState(() {
            _otpError = "OTP sai, vui lòng kiểm tra lại";
          });
        }
      } else {
        setState(() {
          _otpError = "Có lỗi xảy ra, vui lòng thử lại";
        });
      }
    } catch (e) {
      debugPrint("Lỗi khi gọi API check OTP: $e");
      setState(() {
        _otpError = "Không thể kết nối máy chủ";
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
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
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
                          builder: (context) => ForgetPasswordMainPage(),
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
              const Text(
                "Nhập mã đã được nhận",
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                  color: Colors.black87,
                ),
              ),
              const SizedBox(height: 24),

              // TextField OTP
              PinCodeTextField(
                appContext: context,
                length: 6,
                controller: _otpController,
                keyboardType: TextInputType.number,
                animationType: AnimationType.fade,
                cursorColor: Colors.black,
                obscureText: true,
                obscuringCharacter: "*",
                pinTheme: PinTheme(
                  shape: PinCodeFieldShape.box,
                  borderRadius: BorderRadius.circular(8),
                  fieldHeight: 50,
                  fieldWidth: 45,
                  inactiveColor: Colors.grey,
                  activeColor: Colors.teal,
                  selectedColor: Colors.blue,
                  activeFillColor: Colors.white,
                  inactiveFillColor: Colors.white,
                  selectedFillColor: Colors.white,
                ),
                animationDuration: const Duration(milliseconds: 300),
                enableActiveFill: true,
                onCompleted: (value) {
                  _checkOtp(); // Khi nhập đủ 6 số -> gọi API
                },
                onChanged: (value) {
                  setState(() {
                    _otpError = null;
                  });
                },
              ),

              if (_otpError != null)
                Padding(
                  padding: const EdgeInsets.only(top: 8),
                  child: Text(
                    _otpError!,
                    style: const TextStyle(color: Colors.red, fontSize: 14),
                  ),
                ),

              const SizedBox(height: 15),

              const Text(
                "Chúng tôi đã gửi mã đến Email của bạn, vui lòng kiểm tra Email \nQuá trình gửi sẽ mất 1-3 phút",
                style: TextStyle(color: Colors.black, fontSize: 14),
              ),

              const SizedBox(height: 20),

              // Nút kiểm tra OTP
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
                  onPressed: _isLoading ? null : _checkOtp,
                  child: _isLoading
                      ? const CircularProgressIndicator(color: Colors.white)
                      : const Text(
                          "Xác nhận OTP",
                          style: TextStyle(fontSize: 16, color: Colors.white),
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
