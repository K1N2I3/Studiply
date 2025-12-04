# 🛡️ 防止邮件被标记为垃圾邮件指南

## 为什么邮件会被标记为垃圾邮件？

邮件被标记为垃圾邮件通常由以下原因导致：

### 1. **域名认证未配置** ⚠️ 最重要
- **SPF 记录**：未配置或配置错误
- **DKIM 签名**：未启用
- **DMARC 策略**：未设置

### 2. **使用未验证的域名**
- 使用测试邮箱（如 `onboarding@resend.dev`）
- 使用未在邮件服务商验证的域名

### 3. **邮件内容触发过滤器**
- 包含敏感词汇（"免费"、"促销"、"点击这里"等）
- 使用过多感叹号或全大写字母
- 图片过多，文字过少

### 4. **发件人信誉度低**
- 新域名或新 IP 地址
- 发送频率异常
- 被举报过

## ✅ 解决方案

### 方案 1: 使用 Resend（推荐）⭐

Resend 已经配置了 SPF/DKIM/DMARC，但你需要验证域名：

#### 步骤 1: 验证域名

1. 登录 [Resend Dashboard](https://resend.com/domains)
2. 点击 "Add Domain"
3. 输入你的域名（如 `studiply.it`）
4. 按照提示添加 DNS 记录：

**SPF 记录**：
```
Type: TXT
Name: @
Value: v=spf1 include:resend.com ~all
```

**DKIM 记录**（Resend 会提供）：
```
Type: TXT
Name: resend._domainkey
Value: (Resend 提供的值)
```

**DMARC 记录**：
```
Type: TXT
Name: _dmarc
Value: v=DMARC1; p=none; rua=mailto:dmarc@studiply.it
```

5. 等待验证完成（通常几分钟到几小时）

#### 步骤 2: 使用验证的域名

在环境变量中设置：
```bash
RESEND_FROM_EMAIL=noreply@studiply.it  # 使用验证的域名
```

### 方案 2: 配置 SMTP 的 SPF/DKIM/DMARC

如果你使用 SMTP（如 Neo Email），需要在你的域名 DNS 中添加：

#### SPF 记录
```
Type: TXT
Name: @
Value: v=spf1 include:smtp0001.neo.space ~all
```

#### DKIM 记录
联系 Neo Email 支持获取 DKIM 公钥，然后添加：
```
Type: TXT
Name: default._domainkey
Value: (Neo Email 提供的 DKIM 值)
```

#### DMARC 记录
```
Type: TXT
Name: _dmarc
Value: v=DMARC1; p=quarantine; rua=mailto:dmarc@studiply.it
```

### 方案 3: 优化邮件内容

已优化的内容：
- ✅ 避免使用敏感词汇
- ✅ 添加纯文本版本
- ✅ 添加取消订阅链接
- ✅ 使用正常的优先级（不是 high）
- ✅ 添加 List-Unsubscribe 头

### 方案 4: 提高发件人信誉度

1. **逐步增加发送量**：不要一开始就大量发送
2. **监控送达率**：使用 Resend Dashboard 查看统计
3. **处理退信**：及时处理无效邮箱地址
4. **获得用户互动**：鼓励用户将你加入联系人

## 🔍 检查工具

### 1. 检查 SPF/DKIM/DMARC
- [MXToolbox](https://mxtoolbox.com/spf.aspx)
- [DMARC Analyzer](https://www.dmarcanalyzer.com/)

### 2. 测试邮件送达率
- [Mail Tester](https://www.mail-tester.com/)
- 发送测试邮件到提供的地址，查看评分

### 3. 检查黑名单
- [MXToolbox Blacklist Check](https://mxtoolbox.com/blacklists.aspx)

## 📋 最佳实践清单

- [ ] 验证域名（SPF/DKIM/DMARC）
- [ ] 使用验证的域名邮箱
- [ ] 添加纯文本版本
- [ ] 添加取消订阅链接
- [ ] 使用正常的优先级
- [ ] 避免敏感词汇
- [ ] 监控送达率
- [ ] 处理退信
- [ ] 逐步增加发送量

## 🚨 紧急修复

如果邮件已经被大量标记为垃圾邮件：

1. **立即验证域名**：在 Resend 或你的邮件服务商验证域名
2. **使用验证的域名邮箱**：更新 `RESEND_FROM_EMAIL`
3. **等待 24-48 小时**：让 DNS 记录传播
4. **测试发送**：使用 Mail Tester 测试
5. **监控送达率**：在 Resend Dashboard 查看统计

## 📊 Resend 的优势

使用 Resend 的好处：
- ✅ 自动配置 SPF/DKIM/DMARC（只需验证域名）
- ✅ 高送达率（99.9%+）
- ✅ 实时分析和监控
- ✅ 自动处理退信
- ✅ 专业的基础设施

## 🔗 相关资源

- [Resend 域名验证指南](https://resend.com/docs/dashboard/domains/introduction)
- [SPF 记录指南](https://www.cloudflare.com/learning/dns/dns-records/dns-spf-record/)
- [DKIM 记录指南](https://www.cloudflare.com/learning/dns/dns-records/dns-dkim-record/)
- [DMARC 记录指南](https://www.cloudflare.com/learning/dns/dns-records/dns-dmarc-record/)

---

**重要提示**：即使使用 Resend，也**必须验证域名**才能获得最佳送达率。未验证的域名（如 `onboarding@resend.dev`）更容易被标记为垃圾邮件。

