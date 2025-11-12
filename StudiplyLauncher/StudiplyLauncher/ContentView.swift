//
//  ContentView.swift
//  StudiplyLauncher
//
//  Created by Ken Lin on 15/10/25.
//

import SwiftUI
import WebKit

struct ContentView: View {
    @State private var isLoading = true
    @State private var hasError = false
    @State private var errorMessage = ""
    
    var body: some View {
        VStack(spacing: 0) {
            if hasError {
                ErrorView(message: errorMessage) {
                    hasError = false
                    errorMessage = ""
                }
            } else {
                WebViewRepresentable(
                    url: "https://www.studiply.it",
                    isLoading: $isLoading,
                    hasError: $hasError,
                    errorMessage: $errorMessage
                )
                
                if isLoading {
                    LoadingView()
                }
            }
        }
        .frame(minWidth: 1200, minHeight: 800)
        .background(Color(NSColor.windowBackgroundColor))
    }
}

struct WebViewRepresentable: NSViewRepresentable {
    let url: String
    @Binding var isLoading: Bool
    @Binding var hasError: Bool
    @Binding var errorMessage: String
    
    func makeNSView(context: Context) -> WKWebView {
        let config = WKWebViewConfiguration()
        
        // 允许HTTP连接
        config.preferences.setValue(true, forKey: "allowFileAccessFromFileURLs")
        config.preferences.setValue(true, forKey: "allowUniversalAccessFromFileURLs")
        
        let webView = WKWebView(frame: .zero, configuration: config)
        webView.navigationDelegate = context.coordinator
        webView.customUserAgent = "StudiplyLauncher/1.0 (Macintosh; Intel Mac OS X)"
        
        return webView
    }
    
    func updateNSView(_ webView: WKWebView, context: Context) {
        if let url = URL(string: url) {
            let request = URLRequest(url: url)
            webView.load(request)
        }
    }
    
    func makeCoordinator() -> Coordinator {
        Coordinator(self)
    }
    
    class Coordinator: NSObject, WKNavigationDelegate {
        let parent: WebViewRepresentable
        
        init(_ parent: WebViewRepresentable) {
            self.parent = parent
        }
        
        func webView(_ webView: WKWebView, didStartProvisionalNavigation navigation: WKNavigation!) {
            parent.isLoading = true
            parent.hasError = false
        }
        
        func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
            parent.isLoading = false
        }
        
        func webView(_ webView: WKWebView, didFail navigation: WKNavigation!, withError error: Error) {
            parent.isLoading = false
            parent.hasError = true
            parent.errorMessage = error.localizedDescription
        }
        
        func webView(_ webView: WKWebView, didFailProvisionalNavigation navigation: WKNavigation!, withError error: Error) {
            parent.isLoading = false
            parent.hasError = true
            parent.errorMessage = error.localizedDescription
        }
    }
}

struct LoadingView: View {
    @State private var isAnimating = false
    
    var body: some View {
        VStack(spacing: 20) {
            Image(systemName: "bolt.circle.fill")
                .font(.system(size: 60))
                .foregroundColor(.blue)
                .scaleEffect(isAnimating ? 1.2 : 1.0)
                .animation(.easeInOut(duration: 1.0).repeatForever(autoreverses: true), value: isAnimating)
            
            Text("Studiply")
                .font(.largeTitle)
                .fontWeight(.bold)
                .foregroundColor(.primary)
            
            Text("Loading your learning platform...")
                .font(.subheadline)
                .foregroundColor(.secondary)
            
            ProgressView()
                .scaleEffect(1.2)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(Color(NSColor.windowBackgroundColor))
        .onAppear {
            isAnimating = true
        }
    }
}

struct ErrorView: View {
    let message: String
    let onRetry: () -> Void
    
    var body: some View {
        VStack(spacing: 20) {
            Image(systemName: "exclamationmark.triangle.fill")
                .font(.system(size: 60))
                .foregroundColor(.orange)
            
            Text("Connection Error")
                .font(.largeTitle)
                .fontWeight(.bold)
                .foregroundColor(.primary)
            
            Text(message)
                .font(.body)
                .foregroundColor(.secondary)
                .multilineTextAlignment(.center)
                .padding(.horizontal)
            
            Button("Retry") {
                onRetry()
            }
            .buttonStyle(.borderedProminent)
            .controlSize(.large)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(Color(NSColor.windowBackgroundColor))
    }
}

#Preview {
    ContentView()
}
