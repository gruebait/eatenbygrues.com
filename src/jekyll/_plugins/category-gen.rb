module Jekyll

   # Jekyll plugin to generate a category index page for each category used 
   # on the site.
   #
   # For example, given the categories "archives" and "news", this plugin will
   # generate "archives/index.html" and "news/index.html" with each index page
   # containing a listing of the posts in that category.
   #
   # This could be done without a plugin by creating explicit category pages.
   # Doing it this way allows categories to be created and removed on the fly.

   class CategoryPageGenerator < Generator
      safe true
      def generate(site)
         print "Running plugin: Category Generator\n"
         if site.layouts.key? 'category'
            site.categories.each do |cat|
               # Exclude parent categories from processing. See Note 1 below.
               my_dir = cat[1][0].url[/(.*)\//, 1]
               my_leaf = cat[1][0].url[/([^\/]+)\/[^\/]+$/, 1]
               if my_leaf == cat[0]
                  create_category_page(site, my_dir, cat[0])
               end
            end
         end
      end
      def create_category_page(site, dir, cat)
         index = CategoryPage.new(site, site.source, dir, cat)
         index.render(site.layouts, site.site_payload)
         index.write(site.dest)
         site.pages << index
      end
   end

   # A category page listing the posts belonging to the category.
   class CategoryPage < Page
      def initialize(site, base, dir, cat)
         @site = site
         @base = base
         @dir = dir
         @name = 'index.html'
         self.process(@name)
         self.read_yaml(File.join(base, '_layouts'), 'category.html')
         self.data['cat'] = cat
         self.data['title'] = "#{cat}"
      end
   end

end

# Note 1: Special logic to exclude parent categories from processing, for ex.,
# when a post specific "categories: projects some-project" in the YAML.
# In that case we end up with a "projects" category at /projects/ and a
# "some-project" category at /projects/some-project/ and we only want to
# generate category pages for the latter.
