import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  final TextEditingController _nameController = TextEditingController();
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _phoneController = TextEditingController();
  final TextEditingController _addressController = TextEditingController();
  final TextEditingController _genderController = TextEditingController();
  final TextEditingController _dobController = TextEditingController();

  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _getUserInfo();
  }

  Future<void> _getUserInfo() async {
  final prefs = await SharedPreferences.getInstance();
  final email = prefs.getString("email");
  final token = prefs.getString("token");

  print("DEBUG EMAIL: $email");
  print("DEBUG TOKEN: $token");

  if (email == null || token == null) {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text("Không tìm thấy thông tin đăng nhập")),
    );
    return;
  }

  try {
    final response = await http.get(
      Uri.parse("http://localhost:8080/api/v1/user/email?email=$email"),
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer $token",
      },
    );

    print("STATUS CODE: ${response.statusCode}");
    print("RESPONSE BODY: ${response.body}");

    if (response.statusCode == 200) {
      final res = jsonDecode(response.body);
      final data = res["data"];

      setState(() {
        _nameController.text = data["fullName"] ?? "";
        _emailController.text = email;
        _phoneController.text = data["phone"] ?? "";
        _addressController.text = data["address"] ?? "";
        _genderController.text = data["gender"] ?? "";
        _dobController.text = data["dateOfBirth"] ?? "";
        _isLoading = false;
      });
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Lỗi khi lấy thông tin: ${response.body}")),
      );
    }
  } catch (e) {
    print("ERROR: $e");
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text("Không thể kết nối tới server")),
    );
  }
}

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: const Color(0xFF49BBBD),
        title: const Text(
          "Thông tin cá nhân",
          style: TextStyle(color: Colors.white),
        ),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios, color: Colors.white),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : SingleChildScrollView(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  const CircleAvatar(
                    radius: 50,
                    backgroundImage: AssetImage('assets/img/logoVietNam.png'),
                  ),
                  const SizedBox(height: 12),
                  Text(
                    _nameController.text,
                    style: const TextStyle(
                      fontSize: 22,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 20),
                  const Align(
                    alignment: Alignment.centerLeft,
                    child: Text(
                      "Thông tin tài khoản",
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                        color: Colors.teal,
                      ),
                    ),
                  ),
                  const SizedBox(height: 10),
                  _buildTextField("Họ và tên", _nameController),
                  const SizedBox(height: 10),
                  _buildTextField(
                    "Email",
                    _emailController,
                    enabled: false,
                  ), // Email không cho sửa
                  const SizedBox(height: 10),
                  _buildTextField("Số điện thoại", _phoneController),
                  const SizedBox(height: 10),
                  _buildTextField("Địa chỉ", _addressController),
                  const SizedBox(height: 10),
                  _buildTextField("Giới tính", _genderController),
                  const SizedBox(height: 10),
                  _buildTextField("Ngày sinh", _dobController),
                  const SizedBox(height: 20),
                  ElevatedButton(
                    onPressed: () {
                      // TODO: gọi API update user
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text("Cập nhật thành công!")),
                      );
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF49BBBD),
                      minimumSize: const Size(double.infinity, 50),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                    child: const Text(
                      "Cập nhật",
                      style: TextStyle(fontSize: 16, color: Colors.white),
                    ),
                  ),
                ],
              ),
            ),
    );
  }

  Widget _buildTextField(
    String label,
    TextEditingController controller, {
    bool enabled = true,
  }) {
    return TextField(
      controller: controller,
      enabled: enabled,
      decoration: InputDecoration(
        hintText: label,
        filled: true,
        fillColor: Colors.grey.shade100,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide.none,
        ),
      ),
    );
  }
}
