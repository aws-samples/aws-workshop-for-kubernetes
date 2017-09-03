# Kubernetes Getting Started

#### As part of this initial four part series we will accomplish a few key goals:
1. Provision and install a local kubernetes cluster on a mac via homebrew, intended for use as a local development environment for developers to initially gain familiarity with the base kubernetes constructs. As the developer matures the local environment can be used to develop and test functionality release in the latest branches of the main kubernetes project.
2. Familarize ourselves with the kubectl cli tool and basic kubernetes commands. We will first deploy a basic nginx pod and execute some commands to help developers gain comfort with the kubernetes enviornment from an end-user perspective. This helps gets developers up and running taking advantage of the kubernetes application deployment capabilities without having to worry about the infrastructure related complexites.
3. Deploy a 'production-ready' cluster on AWS with KOPS
4. Explore additional developer functionality with core kubernetes constructs such as ReplicaSets, Services, Deployments and DaemonSets.

##### Lets get started with our first goal of getting a local development environment up and running on a mac

We are going to use homebrew to simplify the installation of related software needed to get a Kubernetes developement environment setup on the OSX operating system.

1. Install Homebrew and Cask:
  ```/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"```

    details are avaialble here:
    https://brew.sh/

2.  Install virtualbox:
  ```brew cask install virtualbox```

3.  Install minikube:
  ```brew cask install minikube```

4.  Install kubectl:
  ```brew cask install kuberenetes-cli```

5.  Start minikube - we are using the VirtualBox driver which is the default selection for minikube, if you would like you can use an alternate supported component (xhyve driver or VMware Fusion) using the --vm-driver=xxx flag. For this walkthrough with VirtualBox use:
  ```minikube start```
This will deploy a local Kubernetes 1.7.0 cluster that you can interact with to start developing and testing your application against.

If you see the following output you should be good to go:

![startMiniKube](images/startMiniKube.png)

6.
7.
8.
