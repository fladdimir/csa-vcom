# notes

access locally built images from minikube:  
<https://stackoverflow.com/questions/42564058/how-to-use-local-docker-images-with-minikube>

## use minikube docker env

eval $(minikube docker-env)

[docker build ...]

unset:  
eval $(minikube docker-env -u)

snap-installed docker needs special read permission: <https://github.com/kubernetes/minikube/issues/3083>

(or setup local registry)
