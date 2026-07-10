@echo off
chcp 65001 >nul
node "%~dp0read-utf8.mjs" %*
