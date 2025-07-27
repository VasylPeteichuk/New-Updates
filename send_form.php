<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = htmlspecialchars(trim($_POST["fullName"]));
    $email = htmlspecialchars(trim($_POST["email"]));
    $message = htmlspecialchars(trim($_POST["message"]));

    $to = "peteichukvasyl03@gmail.com";  // Заміни на свою email-адресу
    $subject = "Повідомлення з сайту";
    $body = "Ім'я: $name\nEmail: $email\n\nПовідомлення:\n$message";
    $headers = "From: $email";

    if (mail($to, $subject, $body, $headers)) {
        echo "Дякуємо! Ваше повідомлення надіслано.";
    } else {
        echo "Помилка при відправці повідомлення.";
    }
} else {
    echo "Неправильний метод запиту.";
}
?>