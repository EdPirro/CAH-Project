node("master") {
  stage('Checkout and set agent'){
    checkout scm
  }
}

pipeline {
    agent any

    stages {
        stage('Build & Deploy') {
            when {
                branch "master"
            }

            steps {
                sh '''
                    echo TAG=prod >> .env |
                    echo PORT=$PROD_PORT >> .env
                '''
                sh '''
                    docker compose --env-file .env up --build -d
                '''
            }
        }
    }

    environment {
        PROD_PORT=credentials("PROD_PORT")
    }
}
