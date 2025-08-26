import 'package:flutter/material.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  final TextEditingController _nameController = TextEditingController(text: "Mai Hoàn Thành");
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _phoneController = TextEditingController();
  final TextEditingController _ageController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor:  Color(0xFF49BBBD),
        title: const Text("Thông tin cá nhân", style: TextStyle(color: Colors.white)),
        
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios, color: Colors.white),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: SingleChildScrollView(
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
              style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
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
            _buildTextField("Email", _emailController),
            const SizedBox(height: 10),
            _buildTextField("Số điện thoại", _phoneController),
            const SizedBox(height: 10),
            _buildTextField("Tuổi", _ageController),
            const SizedBox(height: 20),
            ElevatedButton(
              onPressed: () {
                // TODO: xử lý lưu dữ liệu
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text("Cập nhật thành công!")),
                );
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: Color(0xFF49BBBD),
                minimumSize: const Size(double.infinity, 50),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
              child: const Text("Cập nhật", style: TextStyle(fontSize: 16,color: Colors.white)),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTextField(String label, TextEditingController controller) {
    return TextField(
      controller: controller,
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
