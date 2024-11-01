pipeline {
    agent {
        docker {
            image 'python:3.8' // Use an appropriate base image for your build
            args '-u root' // Use root if needed for permission issues
        }
    }

    environment {
        DOCKER_IMAGE_NAME = 'reneboy/docility'
        IMAGE_TAG = "${env.BUILD_NUMBER}" // Use the Jenkins build number as the image tag
    }

    stages {
        stage('Checkout Code') {
            steps {
                echo 'Checking out the code...'
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                echo 'Building Docker image...'
                script {
                    // Build the Docker image with the specified tag
                    sh "docker build -t ${DOCKER_IMAGE_NAME}:${IMAGE_TAG} ."
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                echo 'Pushing Docker image to Docker Hub...'
                script {
                    // Log in to Docker Hub
                    withCredentials([usernamePassword(credentialsId: 'your-docker-credentials-id', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                        sh "echo \"${DOCKER_PASSWORD}\" | docker login -u \"${DOCKER_USERNAME}\" --password-stdin"
                    }
                    // Push the image
                    sh "docker push ${DOCKER_IMAGE_NAME}:${IMAGE_TAG}"
                }
            }
        }
    }

    post {
        success {
            echo 'Docker image built and pushed successfully!'
        }
        failure {
            echo 'There was an issue building or pushing the Docker image.'
        }
    }
}
