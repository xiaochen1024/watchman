#!/usr/bin/expect
set mailto [lindex $argv 0]  
set subject [lindex $argv 1]  
set body [lindex $argv 2]  
set timeout 60
spawn telnet 127.0.0.1 25
expect "220"
#和服务器打招呼
send "HELO user\r"
expect "250"
#验证用户和密码
#send "AUTH LOGIN watchman@frontend-watchman.aa.com\r"
#expect "334"
#send "123456\r"
#expect "235"
#书写信封
send "MAIL FROM:<watchman@frontend-watchman.aa.com>\r"
expect "250"
send "RCPT TO:<$mailto>\r"
expect "250"
#书写新建内容
send "DATA\r"
expect "354"
send "from:发件人邮箱\r"
send "to:$mailto\r"
send "subject:$subject\r"
send "MIME-Version:1.0\r"
send "content-type:text/plain\r\r"
send "$body\r"
send ".\r"
expect "250"
#邮件发送成功，断开连接
send "qiut"
