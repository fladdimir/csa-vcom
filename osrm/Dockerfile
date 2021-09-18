FROM osrm/osrm-backend:v5.22.0
COPY ./data /data
CMD osrm-routed --algorithm mld /data/hamburg-latest.osrm
