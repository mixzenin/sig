<?php
    $servername = "localhost";
    $username = "root";
    $password = "root";
    $dbname = "base";

    header('Content-Type: application/csv');
    header('Content-Disposition: attachment; filename="export.csv";');

    $conn = new mysqli($servername, $username, $password, $dbname);  // Создаем коннект к БД

    $sql = "SELECT DISTINCT * FROM cms_users";  // SQL-запрос
    $result = $conn->query($sql);  // Выполняем запрос

    $fp = fopen("base.txt", 'w');  // Открываем поток для записи

    while($row = $result->fetch_assoc()) {  // Перебираем строки
        $str =  $row['email']."\r\n"; 
        fwrite($fp, $str);
    }

    $conn->close();  // Закрываем коннект к БД
?>