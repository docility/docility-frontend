IMAGE_NAME="${{ env.DOCKER_IMAGE_PREFIX }}-${{ needs.checkout.outputs.branch_name }}"
IMAGE_TAG="${{ needs.checkout.outputs.image_tag }}"
FRONTEND_PORT=8080
sudo docker system prune -af --volumes || true
sudo docker pull $IMAGE_NAME:$IMAGE_TAG
if sudo docker ps -a --format '{{.Names}}' | grep -q 'frontend-app'; then
sudo docker stop frontend-app && sudo docker rm frontend-app
fi
sudo docker run -d --name frontend-app -p $FRONTEND_PORT:80 $IMAGE_NAME:$IMAGE_TAG
sudo systemctl restart nginx