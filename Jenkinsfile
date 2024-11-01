pipeline {
    agent any

    environment {
        // Extract the branch type (e.g., 'feature') from the branch name
        BRANCH_TYPE = "${env.BRANCH_NAME.split('/')[0]}"
        IMAGE_NAME = "reneboy/docility-${BRANCH_TYPE}"
        IMAGE_TAG = "${env.BUILD_NUMBER}" // Use Jenkins build number as the image tag

        // Define a folder path based on the branch type
        FOLDER_PATH = "${BRANCH_TYPE}/build-output"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Prepare Folder') {
            steps {
                script {
                    echo "Creating folder: ${FOLDER_PATH}"
                    sh "mkdir -p ${FOLDER_PATH}" // Create the folder if it doesn't exist
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

        stage('Save Build Output') {
            steps {
                script {
                    echo "Saving build output to folder: ${FOLDER_PATH}"
                    sh "cp -r dist/* ${FOLDER_PATH}/" // Copy build artifacts to the folder
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
