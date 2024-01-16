# Mobiiliohjelmoinnin lopputyö

Tässä dokumentaatiossa käyn läpi lopputyöhön liittyviä teknologioita ja asennuksia.

### Listattuna kaikki asennukset:
**Navigaatio**  
`npm install @react-navigation/native @react-navigation/stack`  
Navigointiin käytetyt komponentit  

**Ulkoasu**  
`npm install @rneui/themed @rneui/base`  
Teema- ja peruskomponentit.

`npx expo install expo-font`  
Mahdollistaa omien fonttien tuomisen.

`npx expo install expo-splash-screen`  
Tarjoaa mahdollisuuden mukauttaa sovelluksen käynnistysnäyttöä sekä odotusta.

`npm install react-native-table-component`  
Tarjoaa taulukkokomponentin

**Firebase/firestore**  
`npm install firebase` sekä `metro.config.js`  
Mahdollistaa Firebase-palveluiden käytön, kuten Firestore-tietokannan ja käyttäjien luomisen/käyttämisen rooleineen.

**bottomsheet**  
`npm i @gorhom/bottom-sheet`  
Tarjoaa alapalkkikomponentin.

`npx expo install react-native-reanimated react-native-gesture-handler`  
react-native-reanimated ja react-native-gesture-handler ovat riippuvuuksia animaatio- ja elekomponentteihin.

`babel.config -> plugins -> 'react-native-reanimated/plugin'`  
babel.config-tiedostoon on lisätty 'react-native-reanimated/plugin'-plugin.

**Muut**  
`npx expo install @react-native-community/datetimepicker`  
Mahdollistaa päivämäärä- ja aikakomponenttien käytön.

`npx expo install expo-image-picker`
Image picker tarjoaa kameran. Myös `app.json` tiedostoon pitää lisätä plugin.
___

### Omat komponentit `components` kansiossa  
**GetUserDetails.js**  
On komponentti, jolla haetaan tietokannasta kirjautuneen käyttänä tiedot.  

**LogOut.js**  
Tämän komponentin avulla voidaan kirjautua ulos hyödyntäen firebasen signouttia.  

**Return.js**  
Return korvaa navigation komponentin headerissa vakiona olevan paluupainikkeen. Näin koko yläpalkki ei ole headerin peittämää.  

**TakePicture.js**  
Komponentti, joka hoitaa kuvan ottamisen ja lähettämisen Firebasen storageen. Palautuksesta otetaan imageUrl, joka tallennetaan kyseisen virheilmoituksen imageUrl kohtaan firestoreen.  

**UserDetails.js**  
Tämä komponentti hakee etusivulle käyttäjätunnuksen ja roolin etusivulle.  


### Omat tyylit `styles/MyStyles.js`  
Tässä kansiossa on lähes kaikki tyylit. Joitain tyylittelyjä ei saanut tähän tuotua, kuten dropdownpickerin avautuvan laatikon tyylejä, mutta lähtökohtana jokaisen komponentin tyylit on säädelty täällä.

### Konfiguraatiot `config` kansiossa  
**FirebaseConfig.js**  
Tämän avulla on luotu yhteen paikkaan kaikki firebaseen liittyvät asetukset.

**metro.config.js**  
Expo dokumentaation mukaan `"Jos käytät Firebase-versiota 9.7.x tai uudempaa, sinun on lisättävä seuraava konfiguraatio metro.config.js-tiedostoon varmistaaksesi, että Firebase JS SDK paketoidaan oikein."`


### Sivut `screens` kansiossa  
Screens kansio pitää sisällään sovelluksen jokaisen avautuvissa olevan sivun.

### `App.js`  
Täällä on määriteltynä oman fontin latautuminen sekä se, että jos ei olla kirjautuneena, näkyy vain sisäänkirjautuminen `login.js` ja sieltä pääsee navigoimaan uuden tunnuksen luontiin `CreateNewUser.js`.
Jos taas on kirjauduttu sisään, päädytään etusivulle `index.js` josta avautuvat avautuu mahdollisuus navigoida eri paikkoihin riippuen roolista.

**Rooli: admin**  
Ajanvaraukset `Reservations.js`  
Varaa aika `Appointment.js`  
Tee vikailmoitus `CreateError.js`  
Lisää vapaita aikoja `CreateAppointsments.js`  
Vikailmoitukset `ErrorNotifications.js`  
Poista saunavuoroja `DeleteAppointments.js`  

**Rooli: user**  
Ajanvaraukset `Reservations.js`  
Varaa aika `Appointment.js`  
Tee vikailmoitus `CreateError.js`  