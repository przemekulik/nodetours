# NodeTours

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licensesMIT)
[![Contributors](https://img.shields.io/github/contributors/przemekulik/nodetours)](https://github.com/przemekulik/nodetours/graphs/contributors)
[![GitHub issues open](https://img.shields.io/github/issues/przemekulik/nodetours)](https://img.shields.io/github/issues/przemekulik/nodetours)
[![Build Status](https://dev.azure.com/przemekulik/nodetours/_apis/build/status/przemekulik.nodetours?branchName=master)](https://dev.azure.com/przemekulik/nodetours/_build/latest?definitionId=1&branchName=feature-2.0.0)

Sample API implementation for fictional NodeTours tour operator company.

## Docker deployment

Build an image:

```zsh
% cd /nodetours
% docker build -t nodetours:2.0 -f deploy/docker/Dockerfile .
```

Change directory and start the stack using docker compose:

```zsh
% cd deploy/docker/
% docker-compose -p nodetours up -d
```

You should see the following output and NodeTours will be up:

```zsh
Creating network "nodetours_nodetours-network" with driver "bridge"
Creating nodetours-db ... done
Creating nodetours-app ... done
```

## Kubernetes deployment

Make sure you have a docker image created for the deployment (see docker instructions above). Deploy the app and service to kubernetes cluster:

```zsh
% cd /nodetours
% kubectl apply -f deploy/kubernetes
```

Check the port through which APIs can be accessed:

```zsh
% kubectl get services nodetours-db
NAME          TYPE      CLUSTER-IP  EXTERNAL-IP PORT(S)         AGE
nodetours-db  NodePort  {your-IP}   <none>      7777:$port/TCP  1m
```

or

```zsh
% kubectl get --namespace default -o jsonpath="{.spec.ports[0].nodePort}" services nodetours
$port
```

$port is the kubernetes ingress port through which NodeTours APIs are reachable.

## Kubernetes deployment using helm

Make sure you have a docker image created for the deployment (see docker instructions above). Deploy the app and service to kubernetes cluster:

```zsh
% cd /nodetours
% helm install {name} deploy/kubernetes/helm
```

where {name} is the name you want to give your instance of NodeTours.

Check the port through which APIs can be accessed:


```zsh
% kubectl get services nodetours
NAME      TYPE      CLUSTER-IP  EXTERNAL-IP PORT(S)         AGE
nodetours NodePort  {your-IP}   <none>      7777:$port/TCP  1m
```

or

```zsh
% kubectl get --namespace default -o jsonpath="{.spec.ports[0].nodePort}" services nodetours
$port
```

$port is the kubernetes ingress port through which NodeTours APIs are reachable.

## Native deployment

To run NodeTours directly on your machine you need a working node.js / npm environment and git. You will also need a running instance of mongo DB.

Get the source code

```zsh
% cd {your workspce}
% git clone https://github.com/przemekulik/nodetours.git
```

Build the app

```zsh
% cd nodetours
% npm run-script build
```

Run it

```zsh
% npm run-script run {DB hostname} {DB port}
```

where {DB hostname} and {DB port} are the hostname and port number of your mongo database.
