# Api pour un Projet de NoSQL et MySQL

Utilisation de l'api.
Obtention température via :
    Longitude et latitude :
    - get http://localhost:3000/api/weather/46&25

    Nom de sites :
    - post http://localhost:3000/api/weather/name
    {
	       "name": "LA BELLE IDEE"
    }

    Identifiant du site : 
    post http://localhost:3000/api/weather/spot
    {
    	"identifiant": "77001"
    }

# Mise en place des serveurs :
    - docker-compose up

# Une fois les serveurs démarrés, exécuter le script.
    - ./script.sh

# Enjoy !