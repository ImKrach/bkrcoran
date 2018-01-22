<?php

 $tafsir = file_get_contents('./quran-tafsir.ar.muyassar.json');
 $simple = file_get_contents('./quran-simple.json');
 $audio = file_get_contents('./quran-audio.ar-alafasy.json');
 $francais = file_get_contents('./quran-francais.fr.hamidullah.json');
$phonetique = file_get_contents('./quran-phonetique.tr.transliteration.json');

$max = file_get_contents('./quran-max.json');


// $surahs_tafsir = json_decode($tafsir, true);
// $surahs_tafsir = $surahs_tafsir["data"]["surahs"];
// $surahs_simple = json_decode($simple, true);
// $surahs_simple = $surahs_simple["data"]["surahs"];
// $surahs_audio = json_decode($audio, true);
// $surahs_audio = $surahs_audio["data"]["surahs"];
// $surahs_francais = json_decode($francais, true);
// $surahs_francais = $surahs_francais["data"]["surahs"];
//$surahs_phonetique = json_decode($phonetique, true);
//$surahs_phonetique = $surahs_phonetique["data"]["surahs"];

$surahs_max = json_decode($max, true);

// $surahs_tafsirEnglish = json_decode($tafsir, true);
// $surahs_tafsirEnglish = $surahs_tafsirEnglish["data"]["surahs"];


//echo "<pre>";
//print_r($surahs_tajweed);

// $output = $surahs_simple;

// // echo "surahs_francais : <br>";
// // print_r($surahs_simple);

// echo "<pre>";

foreach ($surahs_max as $indexSurah => &$surah) {

    foreach ($surah["ayahs"] as $indexAyah => &$ayah) {

        $ayah["phonetique"] = str_replace('e', 'a', $ayah["phonetique"]);
        $ayah["phonetique"] = str_replace('v', 'w', $ayah["phonetique"]);
        $ayah["phonetique"] = str_replace('c', 'j', $ayah["phonetique"]);
//        'ḳ'
//        'ş'
    }
    
}


// // print_r($surahs_simple);

$outputJSON = json_encode($surahs_max);


//$fp = fopen('quran-max.json', 'w');
//fwrite($fp, $outputJSON);
//fclose($fp);

// echo $outputJSON;

// echo "surahs_tafsir : <br>";
// foreach ($surahs_tafsir as $key => $value) {
//     echo "key : $key, value : $value <br>";
// }

// echo "surahs_audio : <br>";
// foreach ($surahs_audio as $key => $value) {
//     echo "key : $key, value : $value <br>";
// }

// echo "surahs_francais : <br>";
// foreach ($surahs_francais as $key => $value) {
//     echo "key : $key, value : $value <br>";
// }



// echo "</pre>";









// // Hamzat ul Wasl
		// $ayah["tajweed"] = preg_replace('/\[h:?[0-9]*\[/', '<Text style={styles.ham_wasl}>', $ayah["tajweed"]);
		// // Silent
		// $ayah["tajweed"] = preg_replace('/\[s:?[0-9]*\[/', '<Text style={styles.slnt}>', $ayah["tajweed"]);

		// // Lam Shamsiyyah
		// $ayah["tajweed"] = preg_replace('/\[l:?[0-9]*\[/', '<Text style={styles.slnt_laam}>', $ayah["tajweed"]);

		// // Normal Prolongation: 2 Vowels
		// $ayah["tajweed"] = preg_replace('/\[n:?[0-9]*\[/', '<Text style={styles.madda_normal}>', $ayah["tajweed"]);

		// // Permissible Prolongation: 2, 4, 6 Vowels
		// $ayah["tajweed"] = preg_replace('/\[p:?[0-9]*\[/', '<Text style={styles.madda_permissible}>', $ayah["tajweed"]);

		// // Qalaqah
		// $ayah["tajweed"] = preg_replace('/\[q:?[0-9]*\[/', '<Text style={styles.qalaqah}>', $ayah["tajweed"]);

		// // Obligatory Prolongation: 4-5 Vowels
		// $ayah["tajweed"] = preg_replace('/\[o:?[0-9]*\[/', '<Text style={styles.madda_obligatory}>', $ayah["tajweed"]);

		// // Ikhafa' Shafawi - With Meem
		// $ayah["tajweed"] = preg_replace('/\[c:?[0-9]*\[/', '<Text style={styles.ikhf_shfw}>', $ayah["tajweed"]);

		// // Ikhafa'
		// $ayah["tajweed"] = preg_replace('/\[f:?[0-9]*\[/', '<Text style={styles.ikhf}>', $ayah["tajweed"]);

		// // Idgham Shafawi - With Meem
		// $ayah["tajweed"] = preg_replace('/\[w:?[0-9]*\[/', '<Text style={styles.idghm_shfw}>', $ayah["tajweed"]);

		// // Iqlab
		// $ayah["tajweed"] = preg_replace('/\[i:?[0-9]*\[/', '<Text style={styles.iqlb}>', $ayah["tajweed"]);

		// // Idgham - With Ghunnah
		// $ayah["tajweed"] = preg_replace('/\[a:?[0-9]*\[/', '<Text style={styles.idgh_ghn}>', $ayah["tajweed"]);

		// // Idgham - Without Ghunnah
		// $ayah["tajweed"] = preg_replace('/\[u:?[0-9]*\[/', '<Text style={styles.idgh_w_ghn}>', $ayah["tajweed"]);

		// // Idgham - Mutajanisayn
		// $ayah["tajweed"] = preg_replace('/\[d:?[0-9]*\[/', '<Text style={styles.idgh_mutj}>', $ayah["tajweed"]);

		// // Idgham - Mutaqaribayn
		// $ayah["tajweed"] = preg_replace('/\[b:?[0-9]*\[/', '<Text style={styles.idgh_mutq}>', $ayah["tajweed"]);

		// // Ghunnah: 2 Vowels
		// $ayah["tajweed"] = preg_replace('/\[g:?[0-9]*\[/', '<Text style={styles.ghunnah}>', $ayah["tajweed"]);

		// // </Text>
		// $ayah["tajweed"] = preg_replace('/\]/', '</Text>', $ayah["tajweed"]);



