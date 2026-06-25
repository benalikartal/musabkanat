$urls = @{
    "gallery1.jpg" = "https://images.unsplash.com/photo-1564834724105-918b73d1b9e0?auto=format&fit=crop&q=80&w=600"
    "gallery2.jpg" = "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=800"
    "gallery3.jpg" = "https://images.unsplash.com/photo-1544025162-81111421550a?auto=format&fit=crop&q=80&w=600"
    "gallery4.jpg" = "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&q=80&w=600"
    "tavuk_sis.jpg" = "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?auto=format&fit=crop&q=80&w=600"
    "kuzu_sis.jpg" = "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=600"
    "adana.jpg" = "https://images.unsplash.com/photo-1615937657715-bc0b6b22fac3?auto=format&fit=crop&q=80&w=600"
    "ayran.jpg" = "https://images.unsplash.com/photo-1620028206132-212726bb4fcd?auto=format&fit=crop&q=80&w=600"
    "salgam.jpg" = "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&q=80&w=600"
    "kola.jpg" = "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=600"
}

foreach ($key in $urls.Keys) {
    Invoke-WebRequest -Uri $urls[$key] -OutFile "C:\Users\petsq\Desktop\musabkanat\images\$key"
}
