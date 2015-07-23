require "rubygems"

module Jekyll

   # In this prototype version of the packager, we create an on-the-fly
   # 'publishables' collection (containing properly selected and ordered
   # RSS/ATOM feed items) that we can access from a template.

   class FeedPackager < Generator
      safe true
      priority :low
      def generate(site)
      
         print "Running plugin: Feed Packager\n"
         publishables = [];

         publishable_posts = site.posts.select{ |p| p.published? && !p.data['hide'] }
         publishable_posts.each do |p|
            p.data['date'] = p.date
            publishables << p
         end

         publishable_posts = site.collections['projects']
         publishable_posts.docs.each do |doc|
            #doc.data['date'] = doc.date
            publishables << doc
         end

         site.data['publishables'] = publishables.sort_by{ |p| p.data['date'] }.reverse

      end
   end

end