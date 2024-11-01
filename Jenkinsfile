pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                script {
                    echo 'Checking out the code...'
                }
                checkout scm
            }
            post {
                success {
                    echo 'Checkout stage completed successfully.'
                }
                failure {
                    echo 'Checkout stage failed.'
                }
            }
        }
        stage('Install Dependencies') {
            steps {
                script {
                    echo 'Installing dependencies...'
                }
                sh 'npm install'
            }
            post {
                success {
                    echo 'Dependencies installed successfully.'
                }
                failure {
                    echo 'Failed to install dependencies.'
                }
            }
        }
        stage('Build') {
            steps {
                script {
                    echo 'Building the Vue app...'
                }
                sh 'npm run build'
            }
            post {
                success {
                    echo 'Build stage completed successfully.'
                }
                failure {
                    echo 'Build stage failed.'
                }
            }
        }
        stage('Docker Build and Push') {
            steps {
                script {
                    echo 'Building Docker image...'
                    def imageTag = "${env.BRANCH_NAME}-${env.BUILD_NUMBER}" // Create a unique tag
                    sh "docker build -t yourdockerhubusername/yourimage:${imageTag} ."
                    echo 'Pushing Docker image...'
                    sh "echo '${DOCKER_PASSWORD}' | docker login -u '${DOCKER_USERNAME}' --password-stdin"
                    sh "docker push yourdockerhubusername/yourimage:${imageTag}"
                }
            }
            post {
                success {
                    echo 'Docker image built and pushed successfully.'
                }
                failure {
                    echo 'Failed to build or push Docker image.'
                }
            }
        }
    }
    post {
        always {
            echo 'This will always run after all stages, regardless of success or failure.'
        }
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed.'
        }
        unstable {
            echo 'Pipeline was unstable.'
        }
    }
}
