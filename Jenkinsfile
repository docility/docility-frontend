pipeline {
    agent {
        docker {
            image 'python:3.8' // Use the appropriate Docker image
            args '-u root' // Run as root if needed for permissions in Docker
        }
    }

    environment {
        IMAGE_NAME = "reneboy/docility"
        IMAGE_TAG = "${env.BUILD_NUMBER}" // Use Jenkins build number as the image tag
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm // Check out the code from version control
            }
        }

        stage('Setup Docker Environment') {
            steps {
                script {
                    // Setup Docker environment if necessary, though usually not required in Jenkins
                    echo 'Setting up Docker environment...'
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    echo "Building Docker image ${IMAGE_NAME}:${IMAGE_TAG}..."
                    sh "docker build -t ${IMAGE_NAME}:${IMAGE_TAG} ."
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                script {
                    echo "Pushing Docker image ${IMAGE_NAME}:${IMAGE_TAG}..."
                    sh 'echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin'
                    sh "docker push ${IMAGE_NAME}:${IMAGE_TAG}"
                }
            }
        }
    }

    post {
        always {
            echo 'Cleaning up Docker resources...'
            sh "docker rmi ${IMAGE_NAME}:${IMAGE_TAG}" // Remove the image after build
        }
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed.'
        }
    }
}
