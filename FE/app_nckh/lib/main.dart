import 'package:app_nckh/chatScreen.dart';
import 'package:app_nckh/introductionApp.dart';
import 'package:app_nckh/loginPage.dart';
import 'package:app_nckh/search.dart';
import 'package:app_nckh/searchSign.dart';
import 'package:app_nckh/settingScreen.dart';
import 'package:flutter/material.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
      ),
      home: introductionApp(),
    );
  }
}

