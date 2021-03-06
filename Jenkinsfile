def label = "worker-${UUID.randomUUID().toString()}"

def notifySlack(STATUS, COLOR) {
    slackSend channel: '#lab23-jks', message: STATUS+" : " + "${env.JOB_NAME}[${env.BUILD_NUMBER}] (${env.BUILD_URL})", color: COLOR, tokenCredentialId: 'slack', teamDomain: 'ibm-teck'
}


podTemplate(label: label, cloud: "academycluster", containers: [
  containerTemplate(name: 'npm', image: 'node:lts', command: 'cat', ttyEnabled: true),
  containerTemplate(name: "scanner", image: "newtmitch/sonar-scanner", ttyEnabled: true, command: "cat"),
  containerTemplate(name: 'docker', image: 'docker:dind', command: 'dockerd --host=unix:///var/run/docker.sock --host=tcp://0.0.0.0:2375 --storage-driver=overlay', ttyEnabled: true, alwaysPullImage: true, privileged: true),
  containerTemplate(name: 'kubectl', image: 'roffe/kubectl', command: 'cat', ttyEnabled: true)
]) {
  node(label) {

	try {
    notifySlack("START", "#00FF00")
		stage('scm') {
			git credentialsId: 'post-academy-git-auth', url: 'https://github.com/maxHyeon/cicd-front.git', branch: 'master'
	    }

    	def props = readProperties  file:"./kubernetes/pipeline.properties"
    	def tag = props["version"]
    	def dockerRegistry = props["dockerRegistry"]
    	def credentialRegistry=props["credentialRegistry"]
    	def image = props["image"]
    	def appname = props["appname"]
    	def containername = props["containerName"]
    	def deployment = props["deployment"]
    	def service = props["service"]
    	def namespace = props["namespace"]
    	def sonarQubeURL = props["sonarQubeURL"]
    	def sonarQubeProject = props["sonarQubeProject"]

	    def timeStamp = System.currentTimeMillis()
	    echo "TimeStamp: ${timeStamp}"
	    tag = tag+"-"+timeStamp

		stage('Build') {
			container('npm') {
				sh "npm install"
			}
		}

		stage('Static Code Analysis') {
			container('scanner') {
				sh "sonar-scanner \
					-Dsonar.projectKey=${sonarQubeProject} \
				  -Dsonar.projectBaseDir=./ \
					-Dsonar.host.url=${sonarQubeURL} \
					-Dsonar.login=60464e819894dc41b45f3eca168784c1b7d76e55"

			}
		}

		stage('Dockerizing') {
			container('docker') {
				docker.withRegistry("${dockerRegistry}", "${credentialRegistry}") {
					sh "docker build -f ./Dockerfile -t ${image}:${tag} ${WORKSPACE}"
					sh "docker push ${image}:${tag}"
					sh "docker tag ${image}:${tag} ${image}:latest"
					sh "docker push ${image}:latest"
				}
			}
		}
        
		stage('Deploy') {
      		container('kubectl') {
				sh "kubectl apply -n ${namespace} -f ${deployment}"
				sh "kubectl apply -n ${namespace} -f ${service}"
				sh "kubectl set image deployment ${appname} ${containername}=${image}:${tag} -n ${namespace}"
				sh "kubectl get svc -n lab23"
      		}
    	}

		notifySlack("SUCCESS", "#00FF00")

	} catch(e) {

	}
  }
}