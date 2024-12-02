from django.db import models
from django.contrib.auth.models import User
from PIL import Image

# Create your models here.
class Post(models.Model):
    author = models.ForeignKey(User,related_name="posts", on_delete=models.CASCADE)
    image = models.ImageField(null=True,blank=True, upload_to='posts')
    body = models.CharField(max_length=255)
    created_on = models.DateTimeField(auto_now_add=True)
    updated_on = models.DateTimeField(auto_now=True)

    def __str__(self):
        return "post "+str(self.pk)+" "+self.author.username +" | "+self.body[:50]

    def save(self,*args,**kwargs):
        super().save(*args, **kwargs)

        img = Image.open(self.image.path)
        if img.height > 300 or img.width > 300:
            output_size = (300,300)
            img.thumbnail(output_size)
            img.save(self.image.path)
    
    class Meta:
        ordering = ['-created_on']

class Like(models.Model):
    author = models.ForeignKey(User,on_delete=models.CASCADE)
    post = models.ForeignKey(Post, related_name="likes", on_delete=models.CASCADE)

    def __str__(self):
        return self.author.username + " | " + self.post.body
    class Meta:
        unique_together = ('author', 'post')#Ensure a user can only like a post once

class Comment(models.Model):
    author = models.ForeignKey(User,on_delete=models.CASCADE)
    post = models.ForeignKey(Post, related_name="comments", on_delete=models.CASCADE)
    comment = models.CharField(max_length=255)
    created_on = models.DateTimeField(auto_now_add=True)
    updated_on = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.author.username + " | " + self.post.body
    
    class Meta:
        ordering = ['-created_on']
