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
        }   
        stage('Docker Build') {
            steps {
                script {
                    echo 'Building Docker image...'
                    def imageTag = "${env.BRANCH_NAME}-${env.BUILD_NUMBER}" // Create a unique tag
                    sh "docker build -t yourdockerhubusername/yourimage:${imageTag} ."
                }
            }
        }
        stage('Docker Push') {
            steps {
                script {
                    echo 'Pushing Docker image...'
                    sh "echo '${DOCKER_PASSWORD}' | docker login -u '${DOCKER_USERNAME}' --password-stdin"
                    sh "docker push yourdockerhubusername/yourimage:${imageTag}"
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
