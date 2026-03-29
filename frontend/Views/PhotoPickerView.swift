import SwiftUI
import PhotosUI

struct PhotoPickerView: UIViewControllerRepresentable {
    var onImagesPicked: ([UIImage]) -> Void
    var onCancel: () -> Void

    func makeUIViewController(context: Context) -> PHPickerViewController {
        var config = PHPickerConfiguration()
        config.selectionLimit = 0 // 0 means multiple selection allowed
        config.filter = .images
        let picker = PHPickerViewController(configuration: config)
        picker.delegate = context.coordinator
        return picker
    }

    func updateUIViewController(_ uiViewController: PHPickerViewController, context: Context) {}

    func makeCoordinator() -> Coordinator {
        Coordinator(self)
    }

    class Coordinator: NSObject, PHPickerViewControllerDelegate {
        let parent: PhotoPickerView

        init(_ parent: PhotoPickerView) {
            self.parent = parent
        }

        func picker(_ picker: PHPickerViewController, didFinishPicking results: [PHPickerResult]) {
            if results.isEmpty {
                parent.onCancel()
                picker.dismiss(animated: true)
                return
            }

            var pickedImages: [UIImage] = []
            let group = DispatchGroup()

            for result in results {
                if result.itemProvider.canLoadObject(ofClass: UIImage.self) {
                    group.enter()
                    result.itemProvider.loadObject(ofClass: UIImage.self) { (object, error) in
                        if let image = object as? UIImage {
                            pickedImages.append(image)
                        }
                        group.leave()
                    }
                }
            }

            group.notify(queue: .main) {
                // Return images in the same format the scanner provides
                self.parent.onImagesPicked(pickedImages)
                picker.dismiss(animated: true)
            }
        }
    }
}
