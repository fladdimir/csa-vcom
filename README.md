# Virtual Commissioning with Casymda

Simulation-based integration testing as part of the build pipeline.  
Sample application for logistics delivery planning & optimization, using Django-Rest-Framework, OSRM, OR-Tools, Angular.  
<https://fladdimir.github.io/post/csa-vcom/>

## Getting started

Spin up the app, running the frontend at <http://localhost:4200>:

```sh
docker-compose up
```

The simulation model can be run outside the pipeline and with enabled animation via <http://localhost:5001>. Start a simulation run and then visit http://localhost:4200/trucks to track the progress of the simulated tours.

![screen-cast](doc/split_x60.gif)

### Local CI setup w/ Gitea + Drone

Official documentation: <https://docs.drone.io/server/provider/gitea/>

```sh
docker-compose -f gitea/docker-compose.yml up
```

edit /etc/hosts: 127.0.0.1 gitea  
register oauth application (settings -> applications)  
set generated client id & secret in drone config (docker-compose -> drone-server -> env vars)  
visit localhost:8000 -> redirect to gitea -> login  
drone: make repository trusted
