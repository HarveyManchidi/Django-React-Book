from django.db import models
from django.contrib.auth.models import User
from PIL import Image

class Profile(models.Model):
    user = models.OneToOneField(User,on_delete=models.CASCADE,null=True)
    profile_image = models.ImageField(upload_to="profile",null=True, blank=True,default="blankprofilepicture.png")
    bio = models.CharField(max_length=255)

    def __str__(self):
        return self.user.username
    
    # resizing an image
    def save(self,*args,**kwargs):
        super().save(*args, **kwargs)

        img = Image.open(self.profile_image.path)
        if img.height > 300 or img.width > 300:
            output_size = (300,300)
            img.thumbnail(output_size)
            img.save(self.profile_image.path)
    

class Follow(models.Model):
    follower = models.ForeignKey(User, related_name='following',
               on_delete=models.CASCADE)
    followed = models.ForeignKey(User, related_name='followers',
               on_delete=models.CASCADE)

    def __str__(self):
        return self.follower.username+" | "+self.followed.username

    class Meta:
        unique_together = ('follower', 'followed')# prevents the following of a user multiple times
