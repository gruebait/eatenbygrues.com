require "rubygems"

module Jekyll

   # Site-specific plugin for EatenByGrues.com.

   class SiteSpecific < Generator
      safe true
      priority :low
      def generate(site)
         # print "Running plugin: Site-Specific\n"
         # # Add index to journal entries (easier here than in the template)
         # index = 0
         # sorted = site.collections['journal'].docs
            # .sort_by { |d| d.data['date'] }
            # .each do |doc|
               # doc.data['index'] = (index += 1)
            # end

         # # Add index to individual pages within series.
         # index = 0;
         # site.collections['projects'].docs.each do |proj|
            # site.categories[proj.data['slug']]
               # .sort_by { |date| }
               # .reverse!
               # .each do |doc|
                  # doc.data['index'] = (index += 1)
               # end
         # end

         # # Add title prefixes for specific content types
         # site.categories['how-to'].each do |f|
            # f.data['title-prefix'] = "How To: "
         # end
         # site.posts.each do |doc|
            # doc.data['title-prefix'] = "FAQ: " if doc.data['layout'] == 'faq'
         # end
      end
   end

end
