require "CGI"

module Jekyll

   class TagPage < Page
      def initialize(site, base, dir, tag)
         @site = site
         @base = base
         @dir = dir
         @name = 'index.html'
         self.process(@name)
         self.read_yaml(File.join(base, '_layouts'), 'tag.html')
         self.data['tag'] = tag
         tag_title_prefix = site.config['tag_title_prefix'] || 'Posts Tagged &ldquo;'
         tag_title_suffix = site.config['tag_title_suffix'] || '&rdquo;'
         self.data['title'] = "#{tag_title_prefix}#{tag}#{tag_title_suffix}"
      end
      def destination(dest)
         super.sub!(/\/index.html$/, '')
      end
   end

   class TagGenerator < Generator
      safe true
      def generate(site)
         print "Running plugin: Tag Generator\n"
         if site.layouts.key? 'tag'
            dir = site.config['tag_dir'] || 'tag'
            site.tags.keys.each do |tag|
               create_tag_page(site, File.join(dir, CGI.escape(tag)), tag)
            end
         end
      end
      def create_tag_page(site, dir, tag)
         index = TagPage.new(site, site.source, dir, tag)
         index.render(site.layouts, site.site_payload)
         index.write(site.dest)
         site.pages << index
      end
   end

end