//
//  FormPilotApp.swift
//  FormPilot
//
//  Created by Yanga Booker on 3/28/26.
//

import SwiftUI

@main
struct FormPilotApp: App {
    @AppStorage("preferredLanguage") var currentLanguage: String = "English"
    
    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(LanguageManager.shared)
                .id(currentLanguage)
        }
    }
}
