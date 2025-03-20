在手机端（移动设备）上，`navigator.clipboard` API 同样可以正常工作，因为现代移动浏览器（如 Chrome、Safari、Firefox 等）都支持这个 API。你可以直接使用前面提到的代码。

不过，在移动设备上，为了确保更好的用户体验，你可能需要处理一些额外的细节，比如用户交互（点击按钮）触发复制操作，因为大多数移动浏览器要求复制操作必须由用户手势（如点击）触发。

以下是一个完整的示例，适用于手机端和桌面端：

### 示例代码

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>复制到剪贴板</title>
</head>
<body>
    <p>点击按钮复制文本：</p>
    <input type="text" id="textToCopy" value="这是要复制的文本" readonly>
    <button onclick="copyToClipboard()">复制文本</button>

    <script>
        function copyToClipboard() {
            const text = document.getElementById('textToCopy').value;
            navigator.clipboard.writeText(text).then(() => {
                alert('文本已成功复制到剪贴板！');
            }).catch(err => {
                alert('无法复制文本，请手动复制。');
                console.error('复制失败: ', err);
            });
        }
    </script>
</body>
</html>
```

### 代码说明
1. **HTML 部分**：
   - 一个输入框（`<input>`）用于显示要复制的文本。
   - 一个按钮（`<button>`），点击时触发复制操作。

2. **JavaScript 部分**：
   - 使用 `navigator.clipboard.writeText()` 将输入框中的文本复制到剪贴板。
   - 如果复制成功，弹出提示框告知用户。
   - 如果复制失败，弹出错误提示，并建议用户手动复制。

3. **移动端适配**：
   - 复制操作由用户点击按钮触发，符合移动浏览器的安全要求。
   - 使用 `alert()` 提示用户复制结果，适合移动端的简单交互。

### 注意事项
- **用户手势**：移动端浏览器要求复制操作必须由用户手势（如点击）触发，不能通过异步操作（如 `setTimeout`）触发。
- **兼容性**：`navigator.clipboard` 在现代浏览器中支持良好，但在一些旧版浏览器中可能不支持。如果需要兼容旧版浏览器，可以尝试使用 `document.execCommand('copy')`，但需要注意它已被弃用。
- **安全性**：`navigator.clipboard` 只能在安全的上下文中使用（HTTPS 或 localhost）。

### 兼容旧版浏览器的代码
如果你需要支持旧版浏览器，可以添加以下兼容代码：

```javascript
function copyToClipboardFallback(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'absolute';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();
    try {
        const success = document.execCommand('copy');
        if (success) {
            alert('文本已成功复制到剪贴板！');
        } else {
            alert('无法复制文本，请手动复制。');
        }
    } catch (err) {
        alert('无法复制文本，请手动复制。');
        console.error('复制失败: ', err);
    }
    document.body.removeChild(textarea);
}

function copyToClipboard() {
    const text = document.getElementById('textToCopy').value;
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            alert('文本已成功复制到剪贴板！');
        }).catch(err => {
            console.error('复制失败: ', err);
            copyToClipboardFallback(text); // 回退到旧方法
        });
    } else {
        copyToClipboardFallback(text); // 直接使用旧方法
    }
}
```

这段代码会优先使用 `navigator.clipboard`，如果不支持则回退到 `document.execCommand('copy')`。
