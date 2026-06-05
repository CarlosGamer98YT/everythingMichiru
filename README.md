# IMPORTANT!

If you want images from Gelbooru and Danbooru to load, you'll need to obtain a username/user ID and an API key for this to work.
Otherwise, you'll just end up with some more generic images.

# Everything Michiru

A browser extension that replaces every image with pictures of Michiru Kagemori!

*This is a fork of [girltwinktaako/everythingMichiru](https://github.com/girltwinktaako/everythingMichiru).*

---

## 🚀 How to Install the Extension (For Users)

To allow other users to install and use this extension quickly and easily, they should follow these steps:

### Step 1: Download and unzip the extension
1. Download the extension code in **ZIP** format (from the green “Code” -> “Download ZIP” button on GitHub, or ask the creator for the `everythingMichiru.zip` file).
2. Unzip the `.zip` file into a folder on your computer (for example, on your Desktop).

### Step 2: Load the extension into your browser
1. Open your Chromium-based browser (such as **Brave**, **Google Chrome**, **Edge**, or **Opera**).
2. In the address bar, type the browser’s extensions path:
   * **Brave:** `brave://extensions/`
   * **Chrome:** `chrome://extensions/`
3. In the top-right corner of the extensions page, **toggle on** the **Developer mode** switch.
4. Click the **Load unpacked** button that appears in the top-left corner.
5. Select the folder you just extracted (the one containing the `manifest.json` file).

And that's it! The extension will be active immediately in your browser.

---

## 🛠️ How to package the extension (For Developers)

If you are the creator and want to compile/package the extension into a single clean `.zip` file (without development files like `.git` or scripts) to send to your friends or users:

1. Open the terminal in the project folder.
2. Run the packaging script:
   ```bash
   ./package.sh
   ```
3. A file named `everythingMichiru.zip` will be generated, ready to send.
