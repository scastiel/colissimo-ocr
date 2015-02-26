# Colissimo-OCR

Colissimo-OCR est une bibliothèque JavaScript permettant d'analyser les images renvoyées par le site de suivi de colis de Colissimo, afin d'en extraire le contenu textuel.

## Installation

L'installation se fait par le gestionnaire de paquet [npmjs](http://www.npmjs.com/) : `npm install colissimo-ocr`.

## Utilisation basique

```javascript
var ocr = require('colissimo-ocr');
ocr.guessTextFromImage('/path/to/image', function(err, str) {
    if (err)
        console.log('Error: ' + err);
    else
        console.log('Text: ' + str);
});
```

Le résultat `str` contient le texte de l'image ; les espaces superflus sont retirés, et le texte est sur une seule ligne. Les caractères qui n'ont pas pu être reconnus sont remplacés par des points d'interrogation `?`.

## En cas de mauvaise reconnaissance

Si un texte est mal reconnu et que souhaitez participer à l'amélioration du module, voici les étapes à suivre :

### 1. Fork du projet

Le plus simple est de forker le dépôt GitHub du projet afin de pouvoir y apporter les modifications que vous souhaitez. Puis récupérez en local le projet via `git clone`.

### 2. Ajout de l'image au jeu de test

Après avoir enregistré l'image contenant les caractères non reconnus, copiez-la dans le répertoire *images/dates* si c'est une date, ou *images/texts* sinon.

![text036.png](https://raw.githubusercontent.com/scastiel/colissimo-ocr/master/images/texts/text036.png)

Puis éditez le fichier *images/dates/dates.js* ou *images/texts/texts.js* en ajoutant une ligne avec le nom de l'image et le texte qu'elle contient, par exemple :

```
"text036.png": "Votre colis est sorti du bureau d'échange. Il est en cours d'acheminement dans le pays de destination",
```

Lancez les tests unitaires du module grâce à la commande `mocha`. Vous devez avoir préalablement installé le module *mocha* : `npm install -g mocha`.

Le test correspondant à l'image doit donc normalement échouer.

```
  1) Colissimo-OCR Texts should guess correct text from images/texts/text036.png:

      Uncaught AssertionError: expected 'Votre colis est sorti du bureau d?change. Il est en cours d\'acheminement dans le pays de destination' to be 'Votre colis est sorti du bureau d\'échange. Il est en cours d\'acheminement dans le pays de destination'
```

### 3. Ajout des caractères manquants

Pour identifier les caractères manquants dans votre image, lancez le script *extractBlocksFromImages.js* : `node cli/extractBlocksFromImages.js images/texts/textXXX.png`. En sortie, vous devriez avoir uniquement les caractères non reconnus dans votre image.

```
$ node cli/extractBlocksFromImages.js images/texts/text036.png
// ---------
//       ••
// •••  •••
// •••
// ••• ••••
//    •• •••
//    ••  ••
//    ••••••
//    ••
//    •• •••
//     •••••
// ---------

r['000000110111001110111000000111011110000110111000110011000111111000110000000110111000011111'] = '';
```

Copiez l'intégralité de la sortie à la fin du fichier *learned/texts.js*, juste avant la dernière ligne `module.exports = r;`, en y insérant les caractères manquants (ici `'é`) :

```javascript
// (...)

// ---------
//       ••
// •••  •••
// •••
// ••• ••••
//    •• •••
//    ••  ••
//    ••••••
//    ••
//    •• •••
//     •••••
// ---------

r['000000110111001110111000000111011110000110111000110011000111111000110000000110111000011111'] = '\'é';

module.exports = r;
```

Relancez ensuite les tests avec la commande `mocha`, ils doivent à présent passer avec succès.

### 4. Pull request

Si vous souhaitez que tous les utilisateurs du module profitent de votre amélioration, n'hésitez pas à proposer une *pull request*, c'est avec plaisir que je l'accepterai.

## Licence

Le code de ce module est fourni sous licence LGPL (voir *LICENSE.txt*).