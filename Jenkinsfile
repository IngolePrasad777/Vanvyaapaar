pipeline {
    agent any

    environment {
        IMAGE_NAME = "samikshamulik22/vanvyaapaar-all-in-one" // lowercase is safer
        IMAGE_TAG = "v2.0"
    }

    stages {

        stage('Try') {
            steps {
                echo "hello i have startyed"
            }
        }

        stage('Checkout Code') {
            steps {
                git branch: 'main', url: 'https://github.com/IngolePrasad777/Vanvyaapaar'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    echo "Building Docker image..."
                    def customImage = docker.build("${IMAGE_NAME}:${IMAGE_TAG}")
                    env.IMAGE_ID = customImage.id
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', 'dockerhub-creds') {
                        docker.image("${IMAGE_NAME}:${IMAGE_TAG}").push()
                    }
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                withCredentials([file(credentialsId: 'abcd', variable: 'KUBECONFIG')]) {
                    sh '''
                    docker run --rm \
                    -v $KUBECONFIG:/root/.kube/config \
                    -v $(pwd):/workspace \
                    -w /workspace \
                    bitnami/kubectl apply -f k8s/
                    '''
                }
            }
        }
    }

    post {
        success { echo "Docker image successfully built and pushed 🚀" }
        failure { echo "Pipeline failed ❌" }
    }
}