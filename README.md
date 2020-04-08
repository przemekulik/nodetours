# NodeTours

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licensesMIT)
[![Contributors](https://img.shields.io/github/contributors/przemekulik/nodetours)](https://github.com/przemekulik/nodetours/graphs/contributors)
[![GitHub issues open](https://img.shields.io/github/issues/przemekulik/nodetours)](https://img.shields.io/github/issues/przemekulik/nodetours)
[![Build Status](https://dev.azure.com/przemekulik/nodetours/_apis/build/status/przemekulik.nodetours?branchName=master)](https://dev.azure.com/przemekulik/nodetours/_build/latest?definitionId=15&branchName=master)

Sample API implementation for fictional NodeTours tour operator company

## Docker deployment

Build an image

```zsh
% cd /nodetours
% docker build -t nodetours:1.0 -f deploy/docker/Dockerfile .
```

Start the container using the docker run command

```zsh
% docker run -d --name nodetours -p 7777:7777 nodetours:1.0
```

## Kubernetes deployment

Make sure you have a docker image created for the deployment (see docker instructions above)
Deploy the app and service to kubernetes cluster

```zsh
% cd /nodetours
% kubectl apply -f deploy/kubernetes
```

Check the port through which APIs can be accessed

```zsh
% kubectl get services nodetours
NAME      TYPE      CLUSTER-IP  EXTERNAL-IP PORT(S)         AGE
nodetours NodePort  {your-IP}   <none>      7777:$port/TCP  1m
```

$port is the kubernetes ingress port through which NodeTours APIs are reachable
