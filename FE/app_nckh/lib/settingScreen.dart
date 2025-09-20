import 'package:app_nckh/chatScreen.dart';
import 'package:app_nckh/loginPage.dart';
import 'package:app_nckh/profileSettings.dart';
import 'package:app_nckh/registerPage.dart';
import 'package:app_nckh/search.dart';
import 'package:app_nckh/searchSign.dart';
import 'package:flutter/material.dart';

class SettingScreen extends StatelessWidget {
   final String token;

  const SettingScreen({super.key, required this.token});


  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Color(0xFF49BBBD),
        title: const Text("Cài đặt", style: TextStyle(color: Colors.white)),
        leading: IconButton(
          onPressed: () => Navigator.pop(context),
          icon: const Icon(Icons.arrow_back_ios, size: 20, color: Colors.white),
        ),
        
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          const Text(
            "Tài khoản",
            style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 10),
          ListTile(
            leading: const Icon(Icons.person),
            title: const Text("Thông tin cá nhân"),
            trailing: const Icon(Icons.arrow_forward_ios, size: 16),
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => const ProfileScreen()),
              );
            },
          ),
          ListTile(
            leading: const Icon(Icons.lock),
            title: const Text("Đổi mật khẩu"),
            trailing: const Icon(Icons.arrow_forward_ios, size: 16),
            onTap: () {
              // TODO: chuyển sang trang đổi mật khẩu
            },
          ),
          const Divider(height: 30),

          ListTile(
            leading: const Icon(Icons.logout, color: Colors.red),
            title: const Text("Đăng xuất", style: TextStyle(color: Colors.red)),
            onTap: () {
               Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => const LoginScreen()),
              );
            },
          ),
        ],
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: 2, // ví dụ index 2 là Setting
        onTap: (index) {
          // TODO: điều hướng theo index
        },
        items: [
          BottomNavigationBarItem(
            icon: IconButton(
              icon: Icon(Icons.search),
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => SearchSignScreen(token: token)),
                );
              },
            ),
            label: "Tìm kiếm",
          ),
          BottomNavigationBarItem(
            icon: IconButton(
              icon: Icon(Icons.chat),
              onPressed: () {
                Navigator.push(
                  context,
              MaterialPageRoute(builder: (context) => RegisterScreen()),
                );
              },
            ),
            label: "Giao tiếp",
          ),
          BottomNavigationBarItem(icon: Icon(Icons.settings), label: 'Cài đặt'),
        ],
      ),
    );
  }
}
