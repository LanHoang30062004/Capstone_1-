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
  final TextEditingController _dobController = TextEditingController();

  String? selectedGender; // Giá trị dropdown
  final List<Map<String, String>> genders = [
    {"value": "male", "label": "Nam"},
    {"value": "female", "label": "Nữ"},
    {"value": "other", "label": "Khác"},
  ];

  String mapGenderApiToDropdown(String? apiGender) {
    switch (apiGender?.toLowerCase()) {
      case "nam":
        return "male";
      case "nữ":
        return "female";
      default:
        return "other";
    }
  }

  String mapGenderDropdownToApi(String dropdownGender) {
    switch (dropdownGender) {
      case "male":
        return "nam";
      case "female":
        return "nữ";
      default:
        return "khác";
    }
  }

  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _getUserInfo();
  }

  void showAutoCloseDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => const AlertDialog(
        title: Text("Thành công"),
        content: Text("Cập nhật thành công!"),
      ),
    );

    Future.delayed(const Duration(seconds: 1), () {
      Navigator.of(context).pop(true); // Đóng dialog
    });
  }

    bool validateInputs() {
    final name = _nameController.text.trim();
    final phone = _phoneController.text.trim();
    final dob = _dobController.text.trim();

    // 1. Validate tên: chỉ cho chữ cái và khoảng trắng
    final nameRegex = RegExp(r"^[a-zA-ZÀ-ỹ\s]+$");
    if (name.isEmpty || !nameRegex.hasMatch(name)) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Tên không hợp lệ (chỉ cho chữ cái, không số/ký tự đặc biệt).")),
      );
      return false;
    }

    // 2. Validate số điện thoại: 10 số
    final phoneRegex = RegExp(r"^[0-9]{10}$");
    if (phone.isEmpty || !phoneRegex.hasMatch(phone)) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Số điện thoại phải có đúng 10 chữ số.")),
      );
      return false;
    }

    
    try {
      final parsedDate = DateTime.parse(dob); 
      final now = DateTime.now();

      if (parsedDate.isAfter(now)) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text("Ngày sinh không được lớn hơn hiện tại.")),
        );
        return false;
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Ngày sinh không hợp lệ. Định dạng: yyyy-mm-dd")),
      );
      return false;
    }

    return true;
  }


    Future<void> _updateUserInfo() async {
    if (!validateInputs()) return;

    final prefs = await SharedPreferences.getInstance();
    final email = prefs.getString("email");
    final token = prefs.getString("token");

    if (email == null || token == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Không tìm thấy thông tin đăng nhập")),
      );
      return;
    }

    try {
      final response = await http.put(
        Uri.parse("http://localhost:8080/api/v1/user"),
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer $token",
        },
        body: jsonEncode({
          "email": email,
          "password": "",
          "fullName": _nameController.text,
          "address": _addressController.text,
          "phone": _phoneController.text,
          "gender": mapGenderDropdownToApi(selectedGender ?? "other"),
          "dateOfBirth": _dobController.text,
        }),
      );

      print("UPDATE STATUS CODE: ${response.statusCode}");
      print("UPDATE RESPONSE BODY: ${response.body}");

      if (response.statusCode == 200) {
        showAutoCloseDialog(context);
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text("Lỗi cập nhật: ${response.body}")),
        );
      }
    } catch (e) {
      print("ERROR: $e");
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Không thể kết nối tới server")),
      );
    }
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
          selectedGender = mapGenderApiToDropdown(data["gender"]);
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
                  DropdownButtonFormField<String>(
                    value: selectedGender,
                    items: genders.map((g) {
                      return DropdownMenuItem<String>(
                        value: g["value"],
                        child: Text(g["label"]!),
                      );
                    }).toList(),
                    onChanged: (val) {
                      setState(() {
                        selectedGender = val;
                      });
                    },
                    decoration: InputDecoration(
                      filled: true,
                      fillColor: Colors.grey.shade100,
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                        borderSide: BorderSide.none,
                      ),
                    ),
                  ),

                  const SizedBox(height: 10),
                  _buildTextField("Ngày sinh", _dobController),
                  const SizedBox(height: 20),
                  ElevatedButton(
                    onPressed: _updateUserInfo,
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

void showAutoCloseDialog(BuildContext context) {
  showDialog(
    context: context,
    builder: (context) => const AlertDialog(
      title: Text("Thành công"),
      content: Text("Cập nhật thành công!"),
    ),
  );

  Future.delayed(const Duration(seconds: 1), () {
    Navigator.of(context).pop(true); // Đóng dialog
  });
}
